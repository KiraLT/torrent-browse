import {
    Provider,
    ProviderSearchOptions,
    ProviderMeta,
    ProviderItem,
} from '../provider'
import { fetchHtml } from '../services/requests'

export class X1337Provider implements Provider {
    name = '1337x'

    protected domain: string = 'https://www.1337x.to'
    protected trackers = [
        'udp://tracker.coppersurfer.tk:6969/announce',
        'udp://9.rarbg.to:2920/announce',
        'udp://tracker.opentrackr.org:1337',
        'udp://tracker.internetwarriors.net:1337/announce',
        'udp://tracker.leechers-paradise.org:6969/announce',
        'udp://tracker.pirateparty.gr:6969/announce',
        'udp://tracker.cyberia.is:6969/announce',
    ]

    async getMeta(): Promise<ProviderMeta> {
        return {
            categories: [
                {
                    name: 'Movies',
                    id: 'Movies',
                    subcategories: [],
                },
                {
                    name: 'TV',
                    id: 'TV',
                    subcategories: [],
                },
                {
                    name: 'Games',
                    id: 'Games',
                    subcategories: [],
                },
                {
                    name: 'Music',
                    id: 'Music',
                    subcategories: [],
                },
                {
                    name: 'Anime',
                    id: 'Anime',
                    subcategories: [],
                },
                {
                    name: 'Apps',
                    id: 'Apps',
                    subcategories: [],
                },
                {
                    name: 'Documentaries',
                    id: 'Documentaries',
                    subcategories: [],
                },
                {
                    name: 'XXX',
                    id: 'XXX',
                    subcategories: [],
                },
                {
                    name: 'Other',
                    id: 'Other',
                    subcategories: [],
                },
            ],
        }
    }

    async search(
        query: string,
        options?: ProviderSearchOptions
    ): Promise<ProviderItem[]> {
        const { category, limit } = options || {}

        const url = category
            ? `${this.domain}/category-search/${encodeURIComponent(
                  query
              )}/${encodeURIComponent(category || '')}/1/`
            : `${this.domain}/search/${encodeURIComponent(query)}/1/`

        const dom = await fetchHtml(url)
        return dom.findAll('tbody > tr')
            .map((el) => {
                const id =
                    (el.findAll('a')[1]?.attrs.href || '').split(
                        '/'
                    )[2] || ''
                return {
                    id,
                    name: el.findAll('a')[1]?.text?.trim() ?? '',
                    seeds: parseInt(el.find('.seeds')?.text?.trim() ?? '', 10) || 0,
                    peers: parseInt(el.find('.leeches')?.text?.trim() ?? '', 10) || 0,
                    comments:
                        parseInt(el.find('.comments')?.text?.trim() ?? '', 10) || 0,
                    size: el.find('.size')?.children[0]?.soup?._text?.trim() ?? '',
                    time: this.parseDate(
                        el.find('.coll-date')?.text?.trim() ?? ''
                    ).getTime(),
                    link: this.domain + el.findAll('a')[1]?.attrs.href ?? '',
                }
            })
    }

    async getMagnet(id: string): Promise<string> {
        const url = `${this.domain}/torrent/${id}/x/`

        const dom = await fetchHtml(url)

        const magnet = dom.find('.torrent-detail-page ul li a')?.attrs.href

        if (!magnet) {
            throw new Error('Failed to load magnet')
        }

        return magnet.trim()
    }

    protected parseDate(value: string): Date {
        return new Date(
            value
                .replace(`'`, '20')
                .replace('th', '')
                .replace('st', '')
                .replace('rd', '')
        )
    }
}