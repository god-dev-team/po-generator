import {
    convertHtmlToPageObject,
    createImportAndClassDeclaration,
    getPageObjectClassForHtmlFilename,
} from '../src/html-to-page-object-converter';
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
    let fullExampleHtml = `
    <div class="container">
    <div class="row ">
        <label class="col-md-12"><h2 translate>admin-benutzer-liste.component.Benutzerverwaltung</h2></label>
    </div>
    <div class="row">
        <div class="col-md-5">
            <input id="admin-benutzer-liste.input.suche" style="width:100%;" placeholder="Suche..." type="text" [(ngModel)]="benutzerName"
            />
        </div>
        <div class="col-md-3">
            <input id="admin-benutzer-liste.input.zuruecksetzen" type="button" class="btn btn-secondary pull-left" (click)="benutzerName = ''"
                value="Zurücksetzen" />
        </div>
        <div class="col-md-4" style="text-align: right;">
            <input id="admin-benutzer-liste.input.neu" type="button" class="btn btn-primary pull-right" [routerLink]="['/adminBenutzerAnlegen']"
                value="Neu" />
        </div>
    </div>
    <div class="row">
        <table id="admin-benutzer-liste.table.benutzerliste" class="col-sm-12 custom-table">
            <thead>
                <tr>
                    <th translate>admin-benutzer-liste.component.Benutzername</th>
                    <th translate>admin-benutzer-liste.component.VornameNachname</th>
                    <th translate>admin-benutzer-liste.component.Arbeitsbereiche</th>
                    <th colspan="2" translate>admin-benutzer-liste.component.Aktionen</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let benutzer of benutzerListe | benutzerFilter: benutzerName" (dblclick)="edit(benutzer.name)" (click)="selectedUser = benutzer"
                    [ngClass]="{'control-activ': selectedUser == benutzer}" style="cursor:pointer;" class="control">
                    <td style="font-weight:bold;">{{benutzer.name}}</td>
                    <td style="font-weight:bold;">{{benutzer.realname}}</td>
                    <td>
                        <ul>
                            <li *ngFor="let berechtigung of getArbeitsbereiche(benutzer); let i=index">
                                <span style="font-weight:bold;">{{ berechtigung.rolle.name }}</span>
                                <span>{{berechtigung.werk.name }}</span>
                            </li>
                        </ul>
                    </td>
                    <td [routerLink]="['/adminBenutzerBearbeiten', benutzer.name]">
                        <span style="font-weight:bold;" class="fa fa-pencil" style="cursor:pointer"></span>
                    </td>
                    <td [routerLink]="['/adminBenutzerLoeschen', benutzer.name]">
                        <span style="font-weight:bold;" class="fa fa-trash" style="cursor:pointer"></span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
    `;

    //
    // Test für das Konvertieren eines input-Felds
    //
    test("convertHtmlToPageObject should parse input-field correctly", () => {
        let filename = "simple-input-example";
        let simpleHtml = '<input type="button"></input><input type="text" id="this.input.should.be.recognized"></input>'
        let expectedPageObject = `import { by, element, ElementFinder } from 'protractor';
export class SimpleInputExamplePageObject {
public static recognizedInputId : string = "this.input.should.be.recognized";

getRecognizedInput() : ElementFinder
{
return element(by.id(SimpleInputExamplePageObject.recognizedInputId));
}
}`;

        // Aus dem Filename wird der Classname des PageObjects erzeugt...
        // ... in diesem Fall SimpleInputExamplePageObject
        assert.equal(convertHtmlToPageObject(simpleHtml, filename), expectedPageObject);
    });

    // Test für das Konvertieren einer komplexen HTML-Page in ein PageObject
    test("convertHtmlToPageObject should parse complex html page correctly", () => {
        let filename = "full-html-example";
        // Aus dem Filename wird der Classname des PageObjects erzeugt...
        // ... in diesem Fall MyHtmlFilePageObject
        // assert.equal(convertHtmlToPageObject(fullExampleHtml, filename), "Converted");
    });

    // Tests für das Konvertieren von Filenames in die PageObject-Classnames
    test("Filename should be converted to PageObjectClass correctly", () => {

        let filename = 'my-file-name.component.html';
        assert.equal(getPageObjectClassForHtmlFilename(filename), "MyFileNamePageObject");

        let filename2 = 'leitstand-liste.component.html';
        assert.equal(getPageObjectClassForHtmlFilename(filename2), "LeitstandListePageObject");

    });
    test("should create Import and class definition, check import", () => {

        let classname = 'AdminBenutzerAnlegenPageObject';
        let expected: string = "import { by, element, ElementFinder } from 'protractor';";
        assert.equal(createImportAndClassDeclaration(classname)[0], expected);

    });
    test("should create Import and class definition, check clas definition", () => {

        let classname = 'AdminBenutzerAnlegenPageObject';
        let expected: string = "export class AdminBenutzerAnlegenPageObject {";
        assert.equal(createImportAndClassDeclaration(classname)[1], expected);

    });
});