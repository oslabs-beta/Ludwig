import * as vscode from 'vscode';
import * as path from 'path';
import { ESLint } from 'eslint';
import { runESLint } from './runESLint';
let extensionContext: vscode.ExtensionContext;
const diagnosticCollection = vscode.languages.createDiagnosticCollection('ludwig_eslint');

let statusBarItem: vscode.StatusBarItem;
let isActiveLintingEnabled = false;
let isAllFilesLintingEnabled = false;
let _currentLintedFile: vscode.Uri | undefined;

export function initializeLinting(context: vscode.ExtensionContext) {
  extensionContext = context;
  context.subscriptions.push(
    vscode.commands.registerCommand('ludwig.toggleLintActiveFile', toggleLintActiveFile),
    vscode.commands.registerCommand('ludwig.toggleLintAllFiles', toggleLintAllFiles),
    vscode.commands.registerCommand('ludwig.clearDiagnostics', clearDiagnostics)
  );

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'ludwig.toggleLintActiveFile';
  context.subscriptions.push(statusBarItem);
  updateStatusBarItem();

  vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    updateStatusBarItem();
    if (editor && isActiveLintingEnabled) {
      await lintDocument(editor.document);
    }
  });

  vscode.workspace.onDidChangeTextDocument(() => {
    updateStatusBarItem();
  });

  vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (isAllFilesLintingEnabled) {
      await lintDocument(document);
    }
  });
}

export async function lintDocument(document: vscode.TextDocument) {
  if (!isAllFilesLintingEnabled) {
    diagnosticCollection.clear();
  }

  _currentLintedFile = document.uri;

  const results = await runESLint(document, extensionContext);
  if (results !== null) {
    const diagnostics = createDiagnosticsFromResults(document, results);
    diagnosticCollection.set(document.uri, diagnostics);
    const fileName = path.basename(document.fileName);
    const numErrors = diagnostics.length;
    showTemporaryInfoMessage(`*${fileName}* processed successfully! ${numErrors} errors found.`);
  } else {
    diagnosticCollection.delete(document.uri);
    const fileName = path.basename(document.fileName);
    showTemporaryInfoMessage(`Linting failed for ${fileName}`);
  }
  updateStatusBarItem();
}

async function toggleLintActiveFile() {
  isActiveLintingEnabled = !isActiveLintingEnabled;
  isAllFilesLintingEnabled = false;
  if (isActiveLintingEnabled) {
    showTemporaryInfoMessage('Linting enabled for active file');
    await lintActiveFile();
  } else {
    diagnosticCollection.clear();
    _currentLintedFile = undefined;
    showTemporaryInfoMessage('Linting disabled for active file');
  }
  updateStatusBarItem();
}

async function toggleLintAllFiles() {
  isAllFilesLintingEnabled = !isAllFilesLintingEnabled;
  isActiveLintingEnabled = false;
  if (isAllFilesLintingEnabled) {
    showTemporaryInfoMessage('Linting enabled for all files');
    await lintAllFiles();
  } else {
    showTemporaryInfoMessage('Linting disabled for all files');
    clearDiagnostics();
  }
  updateStatusBarItem();
}

function clearDiagnostics() {
  diagnosticCollection.clear();
  _currentLintedFile = undefined;
  showTemporaryInfoMessage('Diagnostics cleared for active workspace.');
  updateStatusBarItem();
}

async function lintActiveFile() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    await lintDocument(editor.document);
  }
}

async function lintAllFiles() {
  const documents = vscode.workspace.textDocuments;
  for (const document of documents) {
    await lintDocument(document);
  }
}

export function createDiagnosticsFromResults(
  document: vscode.TextDocument,
  results: ESLint.LintResult[]
): vscode.Diagnostic[] {
  return results.flatMap((result) =>
    result.messages.map((message) => {
      const start = new vscode.Position(message.line - 1, message.column - 1);
      const end = new vscode.Position(message.line - 1, Number.MAX_SAFE_INTEGER);
      const range = new vscode.Range(start, end);

      return new vscode.Diagnostic(
        range,
        message.message,
        message.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
      );
    })
  );
}

function updateStatusBarItem() {
  console.log(`Updating status bar. Active: ${isActiveLintingEnabled}, All: ${isAllFilesLintingEnabled}`);
  if (isActiveLintingEnabled) {
    statusBarItem.text = '$(check) Ludwig: Active File';
    statusBarItem.show();
  } else if (isAllFilesLintingEnabled) {
    statusBarItem.text = '$(check) Ludwig: All Files';
    statusBarItem.show();
  } else {
    statusBarItem.text = '$(x) Ludwig: Disabled';
    statusBarItem.show();
  }
}

function showTemporaryInfoMessage(
  message: string,
  timeout: number = 3000,
  messageType: 'info' | 'statusBar' = 'statusBar'
) {
  if (messageType === 'info') {
    vscode.window.showInformationMessage(message);
  } else {
    const statusBarMessage = vscode.window.setStatusBarMessage(message, timeout);
    setTimeout(() => statusBarMessage.dispose(), timeout);
  }
}
