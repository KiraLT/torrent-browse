import { fetchHtml } from './services/requests'

export interface ProviderItem {
    id: string
    name: string
    seeds: number
    peers: number
    size: number
    link?: string
    date?: number
    magnet?: string
    downloads?: number
    category?: {
        id: string
        name: string
    }
    filesCount?: number
    commentsCount?: number
}

export interface ProviderCategory {
    name: string
    id: string
    subcategories?: {
        name: string
        id: string
    }[]
}

export interface ProviderMeta {
    categories: ProviderCategory[]
}

export interface ProviderSearchOptions {
    /**
     * Category ID to filter by
     */
    category?: string
}

/**
 * Base provider interface that all providers must follow
 */
export interface Provider {
    name: string

    getMeta(): Promise<ProviderMeta>

    search?(
        _query: string,
        _options?: ProviderSearchOptions,
    ): Promise<ProviderItem[]>

    getMagnet?(id: string): Promise<string | undefined>
}

export interface DefaultProviderConfig {
    name: string
    categories: ProviderCategory[]
    itemsSelector: string
    itemSelectors: { [K in keyof ProviderItem]: string }
    searchUrl: (options: ProviderSearchOptions & { query: string }) => string
}

export class CrawlProvider implements Provider {
    name: string

    constructor(protected config: DefaultProviderConfig) {
        this.name = config.name
    }

    async getMeta(): Promise<ProviderMeta> {
        return {
            categories: this.config.categories,
        }
    }
    async search(
        query: string,
        options?: ProviderSearchOptions,
    ): Promise<ProviderItem[]> {
        const url = this.config.searchUrl({ ...options, query })
        const dom = await fetchHtml(url)

        return dom.findAll(this.config.itemsSelector).map((el) => {
            return {
                id: String(
                    el.extract(this.config.itemSelectors.id) || '',
                ).trim(),
                name: String(
                    el.extract(this.config.itemSelectors.name) || '',
                ).trim(),
                seeds:
                    parseInt(
                        el.extract(this.config.itemSelectors.seeds) || '',
                        10,
                    ) || 0,
                peers:
                    parseInt(
                        el.extract(this.config.itemSelectors.peers) || '',
                        10,
                    ) || 0,
                size:
                    parseInt(
                        el.extract(this.config.itemSelectors.size) || '',
                        10,
                    ) || 0,
                link: this.config.itemSelectors.link
                    ? new URL(
                          String(
                              el.extract(this.config.itemSelectors.link) || '',
                          ).trim(),
                          url,
                      ).toString()
                    : undefined,
                magnet: this.config.itemSelectors.magnet
                    ? el.extract(this.config.itemSelectors.magnet)
                    : undefined,
                date: this.config.itemSelectors.date
                    ? parseInt(
                          el.extract(this.config.itemSelectors.date) || '',
                          10,
                      ) || undefined
                    : undefined,
                downloads: this.config.itemSelectors.downloads
                    ? parseInt(
                          el.extract(this.config.itemSelectors.downloads) || '',
                          10,
                      ) || undefined
                    : undefined,
                filesCount: this.config.itemSelectors.filesCount
                    ? parseInt(
                          el.extract(this.config.itemSelectors.filesCount) ||
                              '',
                          10,
                      ) || undefined
                    : undefined,
                commentsCount: this.config.itemSelectors.commentsCount
                    ? parseInt(
                          el.extract(this.config.itemSelectors.commentsCount) ||
                              '',
                          10,
                      ) || undefined
                    : undefined,
            } satisfies ProviderItem
        })
    }
}
