export * from './thepiratebay'
export * from './1337x'
export * from './nyaa'

import { ThePirateBayProvider } from './thepiratebay'
import { X1337Provider } from './1337x'
import { NyaaProvider } from './nyaa'
import { isInBrowser } from '../services/utils'

export const defaultProviders = [
    new ThePirateBayProvider(),
    new NyaaProvider(),
    // These providers does not work in the browser
    ...(!isInBrowser ? [new X1337Provider()] : []),
]
