import { ThePirateBayProvider } from '../../src'
import { assertItem } from './base'

describe('ThePirateBay', () => {
    it('search', async () => {
        const provider = new ThePirateBayProvider()
        const result = await provider.search('harry potter')

        expect(result.length).toBeGreaterThan(1)
        result.forEach(assertItem)
    })
})
