declare module 'jssoup' {
    export default class JSSoup {
        constructor(html: string)
        previousElement: JSSoup
        nextElement: JSSoup
        name?: string
        _text?: string
        text?: string
        attrs?: Record<string, string>
        contents: JSSoup[]
    }
}

declare module 'jssoup-selector' {
    import JSSoup from 'jssoup'

    export default class SoupSelector {
        constructor(adapter: any)
        select(selector: string, soup: JSSoup): JSSoup[]
    }
}