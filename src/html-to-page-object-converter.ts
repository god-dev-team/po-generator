const cheerio = require('cheerio')

export function convertHtmlToPageObject(htmlPage: string): string {
    var $  = cheerio.load('<h2 class="title">Hello world</h2>')
    $('h2.title').text('Hello there!')
    $('h2').addClass('welcome')
    
    var theHtml : string = $.html();
    
    //=> <h2 class="title welcome">Hello there!</h2>   
    return "Converted";
}