const cheerio = require('cheerio')

export function getPageObjectClassForHtmlFilename(filename: string): String {
    // Bis zum ersten Punkt
    if (filename.indexOf('.') <= 0) { return null; }
    let firstPart = filename.split('.')[0];
    // Alle - parts bekommen einen Großbuchstaben 
    let kebabCaseParts: Array<String> = firstPart.split('-');

    let pageObjectClass = '';
    kebabCaseParts.forEach((part: string) => {
        if (part.length > 0) { pageObjectClass += part.substring(0, 1).toUpperCase(); }
        if (part.length > 1) { pageObjectClass += part.substring(1); }
    })

    return pageObjectClass + 'PageObject';
}

export function convertHtmlToPageObject(htmlPage: string, filename: string): string {
    var $ = cheerio.load(htmlPage);

    $('*').each(function (i, elem) {
        console.log("Found tag: " + elem.name + " with id: " + elem.attribs['id'] + " and object:", elem);
    });

    // ForEach auf alle inputs, die nicht type=button haben

    return "Converted";
}

