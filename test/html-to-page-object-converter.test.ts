import { convertHtmlToPageObject } from '../src/html-to-page-object-converter';
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as convert from '../src/html-to-page-object-converter';

// Defines a Mocha test suite to group tests of similar kind together
suite("Html-Converter-Test", () => {

    // Defines a Mocha unit test
    test("should give the correct result", () => {
        assert.equal(convertHtmlToPageObject("<html></html>"), "Converted");
    });
});