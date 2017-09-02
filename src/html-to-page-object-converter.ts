import { isNullOrUndefined } from 'util';
import * as cheerio from 'cheerio';

/**
 * Erzeugt aus einem Filename den korrespondierenden PageObject-Classname
 * @param filename Ein Dateiname in kebap-case-Schreibweise, z.B. my-file-name.component.html
 */
export function getPageObjectClassForHtmlFilename(filename: string): string {
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

    let pageObjectClass: string = getPageObjectClassForHtmlFilename(filename);
    let pageObjectSB: Array<string> = createImportAndClassDeclaration(pageObjectClass);

    // Die public static fields mit den IDs
    $('input').filter(isInputField).each((i, elem) => pageObjectSB.push(getElementIdVariable(elem, "Input")));
    $('input,button').filter(isButton).each((i, elem) => pageObjectSB.push(getElementIdVariable(elem, "Button")));

    // Element-Getter und click-Methods für die Buttons
    $('input').filter(isInputField).each((i, elem) => pushAll(pageObjectSB, getElementGetter(elem, pageObjectClass, "Input")));
    $('input,button').filter(isButton).each((i, elem) => pushAll(pageObjectSB, getElementGetter(elem, pageObjectClass, "Button")));
    $('input,button').filter(isButton).each((i, elem) => pushAll(pageObjectSB, getButtonClickMethod(elem, pageObjectClass)));

    pageObjectSB.push("}");
    return pageObjectSB.join('\n');
}

export function createImportAndClassDeclaration(classname: string): Array<string> {
    let pageObjectSB: Array<string> = new Array;
    pageObjectSB.push("import { browser, by, element, ElementFinder } from 'protractor';");
    pageObjectSB.push("export class " + classname + " {");
    return pageObjectSB;
}
/**
 * Gibt zu einem Element die id aus, anhand der das Element.
 * z.B. aus <input id = foo.bar>  wird
 * public static barInputId = "foo.bar"; 
 */
function getElementIdVariable(element: any, elementType: string): string {
    let elementId = element.attribs['id'];
    if (isNullOrUndefined(elementId)) { return ""; }
    // Aus id=foo.bar wird barInputId
    let elementIdVariableName = getElementIdVariableName(element, elementType);
    return "public static " + elementIdVariableName + " : string = " + '"' + elementId + '";';
}

function getElementIdVariableName(element: any, elementType: string) {
    return getLastPartOfElementId(element) + elementType + "Id";
}

function getElementGetter(element: any, pageObjectClass: String, elementType: string): string[] {
    let elementId = element.attribs['id'];
    if (isNullOrUndefined(elementId)) { return []; }
    let elementGetter: Array<string> = new Array;
    let elementIdVariableName = getElementIdVariableName(element, elementType);
    // Getter
    let elementGetterHeader = "get" + toFirstUpper(getLastPartOfElementId(element)) + elementType + "() : ElementFinder";
    elementGetter.push(elementGetterHeader);
    elementGetter.push("{");
    let elementGetterBody = "return element(by.id(" + pageObjectClass + "." + elementIdVariableName + "));";
    elementGetter.push(elementGetterBody);
    elementGetter.push("}");
    return elementGetter;
}

function getButtonClickMethod(element: any, pageObjectClass: String): string[] {
    let elementId = element.attribs['id'];
    if (isNullOrUndefined(elementId)) { return []; }
    let clickMethod: Array<string> = new Array;
    let elementIdVariableName = getElementIdVariableName(element, "Button");
    // Click-Method
    let elementGetter = "get" + toFirstUpper(getLastPartOfElementId(element)) + "Button()";
    let clickMethodHeader = "click" + toFirstUpper(getLastPartOfElementId(element)) + "Button<P>(clickTargetPageObject: P): P";
    clickMethod.push(clickMethodHeader);
    clickMethod.push("{");
    clickMethod.push("browser.driver.wait(this." + elementGetter + ".click());");
    clickMethod.push("return clickTargetPageObject;");
    clickMethod.push("}");
    return clickMethod;
}

function getLastPartOfElementId(element: any) {
    let elementId = element.attribs['id'];
    let idParts: string[] = elementId.split('.');
    let lastIdPart = idParts[idParts.length - 1];
    return lastIdPart;
}

function isInputField(index: number, element: any): boolean {
    return element.name === 'input' && (isNullOrUndefined(element.attribs['type']) || element.attribs['type'] !== 'button')
}

function isButton(index: number, element: any): boolean {
    return element.name === 'button' || (element.name === 'input' && !isNullOrUndefined(element.attribs['type']) && element.attribs['type'] === 'button')
}

function toFirstUpper(theString: string): string {
    let toFirstUppered = '';
    if (theString.length > 0) { toFirstUppered += theString.substring(0, 1).toUpperCase(); }
    if (theString.length > 1) { toFirstUppered += theString.substring(1); }
    return toFirstUppered;
}

function pushAll<T>(targetArray: Array<T>, toPush: Array<T>) {
    toPush.forEach(t => targetArray.push(t));
}

