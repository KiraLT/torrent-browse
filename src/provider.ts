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
        _options?: ProviderSearchOptions
    ): Promise<ProviderItem[]>

    getMagnet?(id: string): Promise<string | undefined>
}
