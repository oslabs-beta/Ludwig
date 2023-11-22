// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ludwig" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ludwig.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Ludwig!');
	});

		// Register an event listener for document opening
	let documentOpenDisposable = vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
		// Check if the opened document is an HTML file
		if (document.languageId === 'html') {
			// Log a statement when an HTML file is opened
			console.log(`HTML file opened: ${document.fileName}`);
		}
	});

	let hoverProviderDisposable = vscode.languages.registerHoverProvider({ scheme: 'file' }, {
		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			if (range) {
				const text = document.getText(range);
				const hoverMessage = new vscode.MarkdownString(`Hovered over: **${text}**`);
				return new vscode.Hover(hoverMessage, range);
			}
		}
	});

	context.subscriptions.push(disposable, documentOpenDisposable, hoverProviderDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}