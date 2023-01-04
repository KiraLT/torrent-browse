export * from './thepiratebay'
export * from './1337x'

import { ThepiratebayProvider } from './thepiratebay'
import { X1337Provider } from './1337x'

export const defaultProviders = [
    new ThepiratebayProvider(),
    new X1337Provider()
]
