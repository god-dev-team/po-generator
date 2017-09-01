import { isNullOrUndefined } from 'util';
import * as cheerio from 'cheerio';
import * as StringBuilder from 'stringbuilder';

/**
 * Erzeugt aus einem Filename den korrespondierenden PageObject-Classname
 * @param filename Ein Dateiname in kebap-case-Schreibweise, z.B. my-file-name.component.html
 */
export function getPageObjectClassForHtmlFilename(filename: string): String {
    // Bis zum ersten Punkt
    let firstPart = filename.split('.')[0];
    // Alle - parts bekommen einen Großbuchstaben 
    let kebabCaseParts: Array<String> = firstPart.split('-');

    let pageObjectClass = '';
    kebabCaseParts.forEach((part: string) => {
        pageObjectClass += toFirstUpper(part)
    })

    return pageObjectClass + 'PageObject';
}

/**
 * Konvertiert eine Html-Page in PageObjects
 * @param htmlPage 
 * @param filename 
 */
export function convertHtmlToPageObject(htmlPage: string, filename: string): string {
    var $ = cheerio.load(htmlPage);

    /* ForEach auf alle Element
    $('*').each(function (i, elem) {
        console.log("Found tag: " + elem.name + " with id: " + elem.attribs['id'] + " and object:", elem);
    });
    */

    let pageObjectClass = getPageObjectClassForHtmlFilename(filename);
    let pageObjectSB: Array<string> = new Array;
    pageObjectSB.push("import { by, element, ElementFinder } from 'protractor';");
    pageObjectSB.push("export class " + pageObjectClass + "{");

    // ForEach auf alle inputs, die nicht type=button haben
    $('input').filter(isNoButton).each(function (i, elem) {
        let elementId = elem.attribs['id'];
        console.log("Found tag: " + elem.name + " with id: " + elementId + " and object:", elem);

        // Aus id=foo.bar wird barInputId
        let idParts: string[] = elementId.split('.');
        let lastIdPart = idParts[idParts.length - 1];
        let elementIdVariableName = lastIdPart + "InputId";
        pageObjectSB.push("public static " + elementIdVariableName + " : string = " + '"' + elementId + '";');

        // Getter
        let elementGetterHeader = "get" + toFirstUpper(lastIdPart) + "Input() : ElementFinder";
        pageObjectSB.push(elementGetterHeader);
        pageObjectSB.push("{");
        let elementGetterBody = "return element(by.id(" + pageObjectClass + "." + elementIdVariableName + "));";
        pageObjectSB.push(elementGetterBody);
        pageObjectSB.push("}");
    });

    pageObjectSB.push("}");

    return pageObjectSB.join('\n');
}

function isNoButton(index: number, element: any): boolean {
    return isNullOrUndefined(element.attribs['type']) || element.attribs['type'] !== 'button'
}

function toFirstUpper(theString: string): string {
    let toFirstUppered = '';
    if (theString.length > 0) { toFirstUppered += theString.substring(0, 1).toUpperCase(); }
    if (theString.length > 1) { toFirstUppered += theString.substring(1); }
    return toFirstUppered;
}

