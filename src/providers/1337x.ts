import {
    CrawlProvider,
    ProviderSearchOptions,
    ProviderMeta,
    ProviderItem,
} from '../provider'
import { fetchHtml } from '../services/requests'
import { generateQueryString, parseSize } from 'common-stuff'

export class X1337Provider extends CrawlProvider {
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

    constructor() {
        super({
            name: '1337x',
            categories: [
                {
                    name: 'Movies',
                    id: 'Movies',
                },
                {
                    name: 'TV',
                    id: 'TV',
                },
                {
                    name: 'Games',
                    id: 'Games',
                },
                {
                    name: 'Music',
                    id: 'Music',
                },
                {
                    name: 'Anime',
                    id: 'Anime',
                },
                {
                    name: 'Apps',
                    id: 'Apps',
                },
                {
                    name: 'Documentaries',
                    id: 'Documentaries',
                },
                {
                    name: 'XXX',
                    id: 'XXX',
                },
                {
                    name: 'Other',
                    id: 'Other',
                },
            ],
            itemsSelector: 'tbody > tr',
            itemSelectors: {
                id: '.name a:nth-child(2) @ attrs.href | slice:9,16',
                link: '.name a:nth-child(2) @ attrs.href',
                name: '.name a:nth-child(2) @ text',
                seeds: '.seeds @ text | parseInt',
                peers: '.leeches @ text | parseInt',
                size: '.size @ text | parseSize',
                date: '.coll-date @ text | parseDate',
                commentsCount: '.comments @ text | parseInt'
            },
            searchUrl: ({ query, category }) => {
                return category
                    ? `${this.domain}/category-search/${encodeURIComponent(
                          query,
                      )}/${encodeURIComponent(category || '')}/1/`
                    : `${this.domain}/search/${encodeURIComponent(query)}/1/`
            },
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
                .replace('rd', ''),
        )
    }
}
