import { convertHtmlToPageObject, getPageObjectClassForHtmlFilename } from '../src/html-to-page-object-converter';
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
    let exampleHtml = `
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
    // Defines a Mocha unit test
    test("convertHtmlToPageObject should give the correct result", () => {
        assert.equal(convertHtmlToPageObject(exampleHtml, "my-html-file"), "Converted");
    });

    test("Filename should be converted to PageObjectClass correctly", () => {
        let filename = 'my-file-name.component.html';
        assert.equal(getPageObjectClassForHtmlFilename(filename), "MyFileNamePageObject");
    });

    test("Filename leitstand-liste... should be converted to PageObjectClass correctly", () => {
        let filename = 'leitstand-liste.component.html';
        assert.equal(getPageObjectClassForHtmlFilename(filename), "LeitstandListePageObject");
    });
});