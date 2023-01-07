import { ProviderItem } from "../../src";

export function assertItem(item: ProviderItem): void {
    expect(item.id.length).toBeGreaterThan(3)
    expect(item.name.length).toBeGreaterThan(10)
}