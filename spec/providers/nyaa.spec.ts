import { NyaaProvider } from '../../src'
import { assertItem } from './base'

describe('NyaaProvider', () => {
    it('search', async () => {
        const provider = new NyaaProvider()
        const result = await provider.search("sword")
        expect(result.length).toBeGreaterThan(1)
        result.forEach(assertItem)
    })
})