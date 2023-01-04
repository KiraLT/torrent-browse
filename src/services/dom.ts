import JSSoup from 'jssoup'
import SoupSelector from 'jssoup-selector'

class JSSoupAdapter {

    descendants(domElement: any) {
      return domElement.descendants.filter(this.isTagElement)
    }
    
    children(domElement: any) {
      return domElement.contents.filter(this.isTagElement)
    }
    
    nextSibling(domElement: any) {
      var nextSiblings = this.nextSiblings(domElement);
      if (nextSiblings.length > 0) return nextSiblings[0];
      return null;
    }
  
    nextSiblings(domElement: any) {
      return domElement.nextSiblings.filter(this.isTagElement);
    }
  
    elementName(domElement: any) {
      return domElement.name;
    }
  
    attributes(domElement: any) {
      return domElement.attrs
    }
    
    name(domElement: any) {
      return domElement.name
    }
    
    isTagElement(domElement: any) {
      return domElement.constructor.name == "SoupTag"
    }
}

export class DOMElement {
    /** @hidden */
    protected selector = new SoupSelector(new JSSoupAdapter())

    constructor(public soup: JSSoup) {}

    find(selector: string): DOMElement | undefined {
        return this.findAll(selector)[0]
    }

    findAll(selector: string): DOMElement[] {
        return this.selector.select(selector, this.soup).map(v => new DOMElement(v))
    }

    get previousElement(): DOMElement | undefined {
        return this.soup.previousElement ? new DOMElement(this.soup.previousElement) : undefined
    }

    get nextElement(): DOMElement | undefined {
        return this.soup.nextElement ? new DOMElement(this.soup.nextElement) : undefined
    }

    get name(): string {
        return this.soup.name || ''
    }
    
    get text(): string {
        return (this.soup._text || '') + this.soup.text
    }

    get attrs(): Record<string, string> {
        return this.soup.attrs || {}
    }

    get children(): DOMElement[] {
        return this.soup.contents.map(v => new DOMElement(v))
    }
}

export function parseHtml(html: string): DOMElement {
    return new DOMElement(new JSSoup(html))
}
