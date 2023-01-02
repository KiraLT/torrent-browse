import { sortBy, extractWords } from 'common-stuff'
import {
    ProviderMeta,
    ProviderSearchOptions,
    ProviderItem,
    Provider,
} from './provider'

export interface ProvidersResult<T> {
    items: T
    errors: ProviderError[]
}

export interface ProviderError {
    error: string
    provider: string
}

export async function getMeta(
    targetProviders: Provider[]
): Promise<ProvidersResult<ProviderMeta[]>> {
    return executeProviders(targetProviders, (v) => v.getMeta())
}

export async function search(
    targetProviders: Provider[],
    query: string,
    options: ProviderSearchOptions
): Promise<ProvidersResult<ProviderItem[]>> {
    const words = extractWords(query)
    const { errors, items } = await executeProviders(targetProviders, (v) =>
        v.search?.(query, options) ?? []
    )

    return {
        errors,
        items: sortBy(items.flat(), (v) => {
            const index = extractWords(v.name)
            return [
                words.filter((word) => index.includes(word)).length * -1,
                v.seeds * -1,
            ]
        }),
    }
}

async function executeProviders<T>(
    providers: Provider[],
    callback: (provider: Provider) => T | Promise<T>
): Promise<{ items: T[]; errors: ProviderError[] }> {
    const responses = await Promise.all(
        providers.map((v) =>
            Promise.resolve(callback(v)).then(data => ({data})).catch((err) => ({
                error: err instanceof Error ? err.message : String(err),
                provider: v.name,
            }))
        )
    )

    return {
        items: responses.filter((v): v is {data: Awaited<T>} => v && !('error' in v)).map(v => v.data),
        errors: responses.filter((v): v is ProviderError => 'error' in v),
    }
}