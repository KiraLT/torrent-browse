import { search, Provider, getMeta } from '../src'

const item1 = {
    id: '1',
    name: "Harry Potter and the Philosopher's Stone 2001 BDRip 720p",
    seeds: 40,
    peers: 2,
    size: 10000,
}
const item2 = {
    id: '2',
    name: 'Harry Potter and the Chamber of Secrets (2002) 1080p BrRip x264',
    seeds: 2,
    peers: 2,
    size: 10000,
}
const item3 = {
    id: '1',
    name: 'Harry Potter and the Prisoner of Azkaban (2004) 1080p 550MB- YIFY',
    seeds: 4,
    peers: 2,
    size: 10000,
}

const providers: Provider[] = [
    {
        name: 'provider1',
        async getMeta() {
            return {
                categories: [
                    {
                        name: 'Cat1',
                        id: 'ID1',
                    },
                ],
            }
        },
        async search(query: string) {
            if (query.includes('err1')) {
                throw new Error('Error 1')
            }
            return [item2, item1]
        },
    },
    {
        name: 'provider2',
        async getMeta() {
            return {
                categories: [
                    {
                        name: 'Cat2',
                        id: 'ID2',
                    },
                ],
            }
        },
        async search(query: string) {
            if (query.includes('err2')) {
                throw new Error('Error 2')
            }
            return [item3]
        },
    },
]

describe('search', () => {
    it('ranks results by seeds', async () => {
        const result = await search(providers, 'harry potter')

        expect(result).toEqual({
            errors: [],
            items: [
                { provider: 'provider1', data: item1 },
                { provider: 'provider2', data: item3 },
                { provider: 'provider1', data: item2 },
            ],
        })
    })

    it('ranks results by matched words & seeds', async () => {
        const result = await search(providers, 'harry potter 1080p')

        expect(result).toEqual({
            errors: [],
            items: [
                { provider: 'provider2', data: item3 },
                { provider: 'provider1', data: item2 },
                { provider: 'provider1', data: item1 },
            ],
        })
    })

    it('supports partial response', async () => {
        const result = await search(providers, 'harry potter err2')

        expect(result).toEqual({
            errors: [
                {
                    error: 'Error 2',
                    provider: 'provider2',
                },
            ],
            items: [
                { provider: 'provider1', data: item1 },
                { provider: 'provider1', data: item2 },
            ],
        })
    })
})

describe('getMeta', () => {
    it('returns providers meta info', async () => {
        const result = await getMeta(providers)

        expect(result).toEqual({
            errors: [],
            items: [
                {
                    provider: 'provider1',
                    data: {
                        categories: [
                            {
                                name: 'Cat1',
                                id: 'ID1',
                            },
                        ],
                    },
                },
                {
                    provider: 'provider2',
                    data: {
                        categories: [
                            {
                                name: 'Cat2',
                                id: 'ID2',
                            },
                        ],
                    },
                },
            ],
        })
    })
})
