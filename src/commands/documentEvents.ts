import * as vscode from 'vscode';
import { highlightElements } from '../utils/highlightElements';

export function registerDocumentEvents(context: vscode.ExtensionContext) {
  const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === 'html') {
      highlightElements(event.document);
    }
  });

  const activeEditorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && editor.document.languageId === 'html') {
      highlightElements(editor.document);
    }
  });

  const documentOpenDisposable = vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
    if (document.languageId === 'html') {
      highlightElements(document);
    }
  });

  context.subscriptions.push(documentChangeDisposable, activeEditorChangeDisposable, documentOpenDisposable);
}
