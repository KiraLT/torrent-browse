import { generateQueryString, parseSize } from 'common-stuff'
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
            ]
        }
    }

    async search(
        query: string,
        options?: ProviderSearchOptions
    ): Promise<ProviderItem[]> {
        const { category } = options || {}

        const url = `${this.domain}?${generateQueryString({
            q: query,
            c: category
        })}`

        const dom = await fetchHtml(url)
        return dom.findAll('tbody > tr')
            .map((el) => {
                const cols = el.findAll('td')

                const titleA = cols[1]?.findAll('a').filter(v => !('class' in v.attrs))[0]
                const categoryA = cols[0]?.find('a')
                return {
                    id: titleA?.attrs.href?.replace('/view/', '') ?? '',
                    link: titleA?.attrs.href ?? '',
                    name: titleA?.text.trim() ?? '',
                    seeds: parseInt(cols[5]?.text ?? '', 10) || 0,
                    peers: parseInt(cols[6]?.text ?? '', 10) || 0,
                    size: Math.max(parseSize(cols[3]?.text ?? ''), 0),
                    date: Date.parse(cols[5]?.text ?? '') || undefined,
                    commentsCount: parseInt(cols[1]?.find('.comments')?.text ?? '', 10) || undefined,
                    category: categoryA ? {
                        id: categoryA.attrs.href?.replace('/?c=', '') ?? '',
                        name: categoryA.attrs?.title ?? ''
                    } : undefined
                }
            })
    }
}