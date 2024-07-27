import * as vscode from 'vscode';
import { initializeLinting } from './eslint/eslintDiagnostics';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');

  initializeLinting(context);
}

export function deactivate() {}
