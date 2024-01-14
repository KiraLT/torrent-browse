import { ProviderItem } from '../../src'

export function assertResult(result: ProviderItem[]): void {
    expect(result.length).toBeGreaterThan(1)
    result.forEach(assertItem)
}

export function assertItem(item: ProviderItem): void {
    expect(item.id.length).toBeGreaterThan(3)
    expect(item.name.length).toBeGreaterThan(10)
}
