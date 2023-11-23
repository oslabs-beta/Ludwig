import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let hoverProviderDisposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'plaintext' }, {
    provideHover(document, position, token) {
      const wordRange = document.getWordRangeAtPosition(position);
      if (wordRange) {
        const word = document.getText(wordRange);
        const link = 'https://www.google.com';

        const hoverMessage = new vscode.MarkdownString(`[${word}](${link})`);
        return new vscode.Hover(hoverMessage, wordRange);
      }
    }
  });

  context.subscriptions.push(hoverProviderDisposable);
}

export function deactivate() {}
