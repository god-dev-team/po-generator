'use strict';
import { convertHtmlToPageObject } from './html-to-page-object-converter';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'file-system';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "po-generator" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.generatePageObject', () => {
        // The code you place here will be executed every time your command is executed
        handleGenerate();

    });


    context.subscriptions.push(disposable);
}

function handleGenerate() {
    let vs = vscode;
    let editor = vs.window.activeTextEditor;
    let doc = editor.document;
    let myData: string;
    let filename: string = doc.fileName;

    fs.readFile(doc.fileName, 'utf8', (err, data) => {
        if (err) throw err;
        myData = data;
    });

    let filenameOnly = extractFilename(filename);
    let converter = convertHtmlToPageObject(filenameOnly, myData);

    let newFileName = createFile(converter, filename);

    vs.window.showInformationMessage('Done Page Object ' + extractFilename(newFileName) + ' erzeugt!');


}
function createFile(output: string, filename: string): string {
    let newFileName = filename.replace('html', '') + 'po.ts';

    fs.writeFile(newFileName, output, function (err) { });
    return newFileName;
}

export function extractFilename(uri: string): string {
    return path.basename(uri);
}
// this method is called when your extension is deactivated
export function deactivate() {
}