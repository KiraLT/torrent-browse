import fetchPonyfill from 'fetch-ponyfill'
import { parseHtml, DOMElement } from './dom'

const { fetch } = fetchPonyfill()

export async function fetchText(url: string): Promise<string> {
    return fetch(url, {
        headers: {
            'User-Agent': `torrent-browse (+https://github.com/KiraLT/torrent-browse)`
        }
    }).then(v => v.text())
}

export async function fetchJson<T = unknown>(url: string): Promise<T> {
    return JSON.parse(await fetchText(url))
}

export async function fetchHtml(url: string): Promise<DOMElement> {
    return parseHtml(await fetchText(url))
}
