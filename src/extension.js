'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import renamePaths from './renamePaths';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "js-path-refactor" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.jsRefactorMove', (e) => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const previousPath = e ? e.path : vscode.window.activeTextEditor.document.fileName
        vscode.window.showInputBox({
            prompt: 'Move/Rename to',
            value: previousPath
        }).then(function (nextPath) {
            if (!nextPath) {
                return
            }
            return vscode.window.showInputBox({
                prompt: 'Choose path to fix in',
                value: previousPath
            }).then((searchInPath) => {
                return vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: 'Refactoring paths...'
                }, () => {
                    // Progress is shown while this function runs.
                    // It can also return a promise which is then awaited
                    return renamePaths(previousPath, nextPath, searchInPath).catch((e) => {
                        console.error('error12312', e)
                        vscode.window.showErrorMessage(e.message)
                    })
                })
            })
        }).catch((e) => {
            console.error('error12312', e)
            vscode.window.showErrorMessage(e.message)
        })
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}