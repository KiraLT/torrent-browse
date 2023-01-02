import { X1337Provider } from '../../src'
import { assertItem } from './base'


describe('X1337Provider', () => {
    it('search', async () => {
        const provider = new X1337Provider()
        const result = await provider.search("harry potter")
        expect(result.length).toBeGreaterThan(1)
        result.forEach(assertItem)
    })
})