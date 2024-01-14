import { sortBy, extractWords } from 'common-stuff'
import {
    ProviderMeta,
    ProviderSearchOptions,
    ProviderItem,
    Provider,
} from './provider'

/**
 * Provider action result data that may contain list of errors
 */
export interface ProvidersResult<T> {
    items: {
        data: T
        provider: string
    }[]
    errors: ProviderError[]
}

/**
 * Provider action error
 */
export interface ProviderError {
    error: string
    provider: string
}

/**
 * Returns meta from each providers with list of errors (if any)
 *
 * @param targetProviders provider list
 * @returns providers meta
 * @example
 * ```
 * getMeta(defaultProviders)
 * // { items: [ { provider: 'ThePirateBay', 'data': { categories: [...] } } ] }
 * ```
 */
export async function getMeta(
    targetProviders: Provider[],
): Promise<ProvidersResult<ProviderMeta>> {
    return executeProviders(targetProviders, (v) => v.getMeta())
}

/**
 * Executes search on each provider
 *
 * @param targetProviders
 * @param query
 * @param options
 * @returns
 */
export async function search(
    targetProviders: Provider[],
    query: string,
    options?: ProviderSearchOptions,
): Promise<ProvidersResult<ProviderItem>> {
    const words = extractWords(query)
    const { errors, items } = await executeProviders(
        targetProviders,
        (v) => v.search?.(query, options) ?? [],
    )
    return {
        errors,
        items: sortBy(
            items.flatMap((v) =>
                v.data.map((vv) => ({
                    provider: v.provider,
                    data: vv,
                })),
            ),
            (v) => {
                const index = extractWords(v.data.name)
                return [
                    words.filter((word) => index.includes(word)).length * -1,
                    v.data.seeds * -1,
                ]
            },
        ),
    }
}

/**
 * Executes callback on each provider and collects errors & responses
 *
 * @param providers list of providers
 * @param callback callback that should be executed on each provider
 * @param options provider execution custom options
 * @returns list of errors and list of responses from each provider
 * @example
 *
 * ```
 * executeProviders(defaultProviders, (v) => v.getMeta())
 * ```
 */
export async function executeProviders<T>(
    providers: Provider[],
    callback: (provider: Provider) => T | Promise<T>,
): Promise<ProvidersResult<T>> {
    const responses = await Promise.all(
        providers.map((v) =>
            Promise.resolve(callback(v))
                .then((data) => ({
                    data,
                    provider: v.name,
                }))
                .catch((err) => ({
                    error: err instanceof Error ? err.message : String(err),
                    provider: v.name,
                })),
        ),
    )

    return {
        items: responses.flatMap((v) => ('data' in v ? [v] : [])),
        errors: responses.flatMap((v) => ('error' in v ? [v] : [])),
    }
}
