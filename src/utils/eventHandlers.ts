import * as vscode from 'vscode';
import { lintDocument } from '../eslint/eslintDiagnostics'; // Assuming you have this function defined elsewhere

let activeFileListener: vscode.Disposable | undefined;
let allFilesListener: vscode.Disposable | undefined;

export let isActiveLintingEnabled = false;
export let isAllFilesLintingEnabled = false;

export function setupActiveFileListener() {
  if (activeFileListener) {
    activeFileListener.dispose();
  }
  activeFileListener = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    if (editor && isActiveLintingEnabled) {
      await lintDocument(editor.document);
    }
  });
}

export function setupAllFilesListener() {
  if (allFilesListener) {
    allFilesListener.dispose();
  }
  allFilesListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (isAllFilesLintingEnabled) {
      await lintDocument(document);
    }
  });
}

export function disposeListeners() {
  if (activeFileListener) {
    activeFileListener.dispose();
  }
  if (allFilesListener) {
    allFilesListener.dispose();
  }
}

export function setActiveLinting(value: boolean) {
  isActiveLintingEnabled = value;
}

export function setAllFilesLinting(value: boolean) {
  isAllFilesLintingEnabled = value;
}
