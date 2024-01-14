import { NyaaProvider } from '../../src'
import { assertResult } from './base'

describe('NyaaProvider', () => {
    it('search', async () => {
        const provider = new NyaaProvider()
        const result = await provider.search('sword')

        assertResult(result)
    })
})
