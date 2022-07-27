import { ProviderItem } from "../../src";

export function assertItem(item: ProviderItem): void {
    expect(item.id.length).toBeGreaterThan(3)
}