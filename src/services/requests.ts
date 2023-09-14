import fetchPonyfill from 'fetch-ponyfill'
import { shuffle } from 'common-stuff'
import { parseHTML, IsomorphicHTMLElement } from 'isomorphic-htmlparser'

import { isInBrowser } from './utils'

const { fetch } = fetchPonyfill()

async function fetchBrowser(url: string): Promise<string> {
    const proxies = shuffle<(v: string) => string>([
        v => `https://api.allorigins.win/raw?url=${encodeURIComponent(v)}`,
        v => `https://proxy.torrent-browse.workers.dev/?url=${encodeURIComponent(v)}`
    ])
    const proxyUrls = proxies.map(v => v(url))

    const retry = async (url: string, proxies: string[]): Promise<string> => {
        return fetch(url)
            .then(v => {
                if (!v.ok) {
                    throw new Error(`Proxy or API returned ${v.status} status code`)
                }

                return v.text()
            })
            .catch(err => {
                const nextUrl = proxies.pop()

                if (nextUrl) {
                    return retry(nextUrl, proxies)
                }
    
                return Promise.reject(err)
            })
    }

    return retry(proxyUrls.pop()!, proxyUrls)
}

async function fetchNode(url: string): Promise<string> {
    return fetch(url, {
        headers: {
            'User-Agent': `torrent-browse (+https://github.com/KiraLT/torrent-browse)`
        }
    }).then(v => v.text())
}

export async function fetchText(url: string): Promise<string> {
    if (isInBrowser) {
        return fetchBrowser(url)
    }
    return fetchNode(url)
}

export async function fetchJson<T = unknown>(url: string): Promise<T> {
    return JSON.parse(await fetchText(url))
}

export async function fetchHtml(url: string): Promise<IsomorphicHTMLElement> {
    return parseHTML(await fetchText(url))
}
