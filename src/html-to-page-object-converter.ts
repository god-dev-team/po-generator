const cheerio = require('cheerio')

export function convertHtmlToPageObject(htmlPage: string, filename: string): string {
    var $ = cheerio.load(htmlPage);

    $('*').each(function (i, elem) {
        console.log("Found tag: " + elem.name + " with id: " + elem.attribs['id'] + " and object:",elem);
    });

    return "Converted";
}