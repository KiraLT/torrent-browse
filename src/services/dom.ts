const JSSoup = require('jssoup').default

export interface DOMElement {
    select(selector: string): DOMElement[]
    selectOne(selector: string): DOMElement
    text: string
    name: string
    attrs: Record<string, string>
}

export function parseHtml(html: String): DOMElement {
    return new JSSoup(html)
}
