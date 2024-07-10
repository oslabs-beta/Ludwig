import * as vscode from 'vscode';
import { highlightElements, clearHighlights } from '../utils/highlightElements';

export function registerHighlightElementsCommand(context: vscode.ExtensionContext) {
  const highlightCommandDisposable = vscode.commands.registerCommand('ludwig.highlightElements', () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.languageId === 'html') {
      const document = activeEditor.document;
      highlightElements(document);
    }
  });

  context.subscriptions.push(highlightCommandDisposable);
}

export function registerToggleOffCommand(context: vscode.ExtensionContext) {
  const toggleOffCommandDisposable = vscode.commands.registerCommand('ludwig.toggleOff', () => {
    clearHighlights();
  });

  context.subscriptions.push(toggleOffCommandDisposable);
}
