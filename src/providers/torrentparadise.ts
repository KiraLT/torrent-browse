import { formatBytes } from 'common-stuff'

import { Provider, ProviderItem, ProviderMeta, ProviderSearchOptions } from '../provider'
import { fetchJson } from '../services/requests'
import { formatMagnet } from '../services/torrent'

interface TorrentParadiseItem {
    id: string
    l: number
    len: number
    s: number
    text: string
}

export class TorrentParadiseProvider implements Provider {
    name = 'TorrentParadise.ml'

    protected domain: string = 'https://torrent-paradise.ml'

    async getMeta(): Promise<ProviderMeta> {
        return {
            categories: [],
        }
    }

    async search(
        query: string,
        options?: ProviderSearchOptions
    ): Promise<ProviderItem[]> {
        const {} = options || {}

        const url = `${this.domain}/api/search?q=${encodeURIComponent(query)}`
        const result = await fetchJson<TorrentParadiseItem[]>(url)

        return result.map((v) => ({
            id: v.id,
            name: v.text,
            magnet: formatMagnet(v.id, v.text, []),
            seeds: v.s,
            peers: v.l,
            size: formatBytes(v.len),
            category: {
                name: 'All',
                id: '',
            },
        }))
    }
}