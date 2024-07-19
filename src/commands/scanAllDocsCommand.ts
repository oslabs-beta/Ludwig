import * as vscode from 'vscode';

export function registerScanAllDocsCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ludwig.scanAllDocs', () => {
    vscode.window.showWarningMessage('Feature not available yet');
  });

  context.subscriptions.push(disposable);
}
