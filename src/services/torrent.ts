export function formatMagnet(
    infoHash: string,
    name: string,
    trackers: string[]
) {
    const trackersQueryString = trackers.length
        ? `&tr=${trackers.map(encodeURIComponent).join('&tr=')}`
        : ''
    return `magnet:?xt=urn:btih:${encodeURIComponent(infoHash)}&dn=${encodeURIComponent(
        name
    )}${trackersQueryString}`
}
