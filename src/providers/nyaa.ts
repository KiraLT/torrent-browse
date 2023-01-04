import { generateQueryString } from 'common-stuff'
import { Provider, ProviderItem, ProviderMeta, ProviderSearchOptions } from '../provider'
import { fetchHtml } from '../services/requests'

export class NyaaProvider implements Provider {
    name = 'Nyaa'

    protected domain = 'https://nyaa.si/'

    async getMeta(): Promise<ProviderMeta> {
        return {
            categories: [
                {
                    name: 'Anime',
                    id: '1_0',
                    subcategories: [
                        {
                            name: 'AMV',
                            id: '1_1',
                        },
                        {
                            name: 'English',
                            id: '1_2',
                        },
                        {
                            name: 'Non-English',
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
                            name: 'Literature - English',
                            id: '3_1',
                        },
                        {
                            name: 'Literature - Non-English',
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
                            name: 'Live Action - English',
                            id: '4_1',
                        },
                        {
                            name: 'Live Action - Idol/PV',
                            id: '4_2',
                        },
                        {
                            name: 'Live Action - Non-English',
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
                            name: 'Software - Apps',
                            id: '6_1',
                        },
                        {
                            name: 'Software - Games',
                            id: '6_2',
                        },
                    ],
                },
            ]
        }
    }

    async search(
        query: string,
        options?: ProviderSearchOptions
    ): Promise<ProviderItem[]> {
        const { category, limit } = options || {}

        const url = `${this.domain}?${generateQueryString({
            q: query,
            c: category
        })}`

        const dom = await fetchHtml(url)
        return dom.findAll('.torrent-list > tbody > tr')
            .map((el) => {
                return {
                    id: '',
                    name: '',
                    seeds: 0,
                    peers: 0,
                    size: ''
                }
            })
    }
}