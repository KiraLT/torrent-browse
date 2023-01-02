export interface ProviderItem {
    id: string
    name: string
    magnet?: string
    seeds: number
    peers: number
    size: string
    time?: number
    downloads?: number
    category?: {
        id: string
        name: string
    }
    link?: string
    isVip?: boolean
    imdb?: string
    numFiles?: number
    comments?: number
}

export interface ProviderCategory {
    name: string
    id: string
    subcategories: {
        name: string
        id: string
    }[]
}

export interface ProviderMeta {
    categories: ProviderCategory[]
}

export interface ProviderSearchOptions {
    category?: string
    limit?: number
}

export interface Provider {
    name: string

    getMeta(): Promise<ProviderMeta>

    search?(
        _query: string,
        _options?: ProviderSearchOptions
    ): Promise<ProviderItem[]>

    getMagnet?(id: string): Promise<string | undefined>
}
