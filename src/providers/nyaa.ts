import { generateQueryString } from 'common-stuff'
import { CrawlProvider } from '../provider'

export class NyaaProvider extends CrawlProvider {
    constructor() {
        super({
            name: 'Nyaa',
            categories: [
                {
                    name: 'Anime',
                    id: '1_0',
                    subcategories: [
                        {
                            name: 'Anime Music Video',
                            id: '1_1',
                        },
                        {
                            name: 'English-translated',
                            id: '1_2',
                        },
                        {
                            name: 'Non-English-translated',
                            id: '1_3',
                        },
                        {
                            name: 'Raws',
                            id: '1_4',
                        },
                    ],
                },
                {
                    name: 'Audio',
                    id: '2_0',
                    subcategories: [
                        {
                            name: 'Audio - Lossless',
                            id: '2_1',
                        },
                        {
                            name: 'Audio - Lossy',
                            id: '2_2',
                        },
                    ],
                },
                {
                    name: 'Literature',
                    id: '3_0',
                    subcategories: [
                        {
                            name: 'Literature - English-translated',
                            id: '3_1',
                        },
                        {
                            name: 'Literature - Non-English-translated',
                            id: '3_2',
                        },
                        {
                            name: 'Literature - Raws',
                            id: '3_3',
                        },
                    ],
                },
                {
                    name: 'Live Action',
                    id: '4_0',
                    subcategories: [
                        {
                            name: 'Live Action - English-translated',
                            id: '4_1',
                        },
                        {
                            name: 'Live Action - Idol/Promotional Video',
                            id: '4_2',
                        },
                        {
                            name: 'Live Action - Non-English-translated',
                            id: '4_3',
                        },
                        {
                            name: 'Live Action - Raws',
                            id: '4_4',
                        },
                    ],
                },
                {
                    name: 'Pictures',
                    id: '5_0',
                    subcategories: [
                        {
                            name: 'Pictures - Graphics',
                            id: '5_1',
                        },
                        {
                            name: 'Pictures - Photos',
                            id: '5_2',
                        },
                    ],
                },
                {
                    name: 'Software',
                    id: '6_0',
                    subcategories: [
                        {
                            name: 'Software - Applications',
                            id: '6_1',
                        },
                        {
                            name: 'Software - Games',
                            id: '6_2',
                        },
                    ],
                },
            ],
            itemsSelector: 'tbody > tr',
            itemSelectors: {
                id: 'td:nth-child(2) a:not(.comments) @ attrs.href | slice:6',
                link: 'td:nth-child(2) a:not(.comments) @ attrs.href',
                name: 'td:nth-child(2) a:not(.comments) @ attrs.title',
                seeds: 'td:nth-child(6) @ text | parseInt',
                peers: 'td:nth-child(7) @ text | parseInt',
                size: 'td:nth-child(4) @ text | parseSize',
                magnet: 'td:nth-child(3) a:nth-child(2) @ attrs.href',
                date: 'td:nth-child(5) @ attrs.data-timestamp | parseInt',
                downloads: 'td:nth-child(8) @ text | parseInt',
            },
            searchUrl: ({ query, category }) =>
                `https://nyaa.si/?${generateQueryString({
                    q: query,
                    c: category,
                })}`,
        })
    }
}
