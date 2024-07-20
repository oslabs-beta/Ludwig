import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ESLint } from 'eslint';
import { runESLint } from './runESLint';
import { ruleSeverityMapping } from './ruleSeverityMapping';

let extensionContext: vscode.ExtensionContext;
const diagnosticCollection = vscode.languages.createDiagnosticCollection('ludwig_eslint');

let statusBarItem: vscode.StatusBarItem;
let isActiveLintingEnabled = false;
let isAllFilesLintingEnabled = false;
let _currentLintedFile: vscode.Uri | undefined;

interface LintIssue {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  nodeType?: string;
  customSeverity?: number;
}

interface LintResult {
  summary: {
    dateCreated: string;
    timeCreated: string;
    activeWorkspace: string;
    filepath: string;
    errors: number;
    warnings: number;
  };
  details: LintIssue[];
}

export function initializeLinting(context: vscode.ExtensionContext) {
  extensionContext = context;
  context.subscriptions.push(
    vscode.commands.registerCommand('ludwig.toggleLintActiveFile', toggleLintActiveFile),
    vscode.commands.registerCommand('ludwig.toggleLintAllFiles', toggleLintAllFiles),
    vscode.commands.registerCommand('ludwig.clearDiagnostics', clearDiagnostics),
    vscode.commands.registerCommand('ludwig.saveLintResults', saveLintResults)
    // vscode.commands.registerCommand('ludwig.resetLib', resetLib)
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

export async function lintDocument(document: vscode.TextDocument, saveResults: boolean = false) {
  if (!isAllFilesLintingEnabled) {
    diagnosticCollection.clear();
  }

  _currentLintedFile = document.uri;

  const results = await runESLint(document, extensionContext);
  if (results !== null) {
    const lintResult = createLintResultFromESLintResults(document, results);
    const diagnostics = createDiagnosticsFromLintResult(document, lintResult);
    diagnosticCollection.set(document.uri, diagnostics);

    // Save results to central JSON library
    if (saveResults) {
      saveLintResultToLibrary(lintResult);
    }
    const fileName = path.basename(document.fileName);
    const numIssues = lintResult.details.length;
    showTemporaryInfoMessage(`*${fileName}* processed successfully! ${numIssues} issues found.`);
  } else {
    diagnosticCollection.delete(document.uri);
    const fileName = path.basename(document.fileName);
    showTemporaryInfoMessage(`Linting failed for ${fileName}`);
  }
  updateStatusBarItem();
}

function createLintResultFromESLintResults(document: vscode.TextDocument, results: ESLint.LintResult[]): LintResult {
  const details: LintIssue[] = [];
  let errors = 0;
  let warnings = 0;

  results.forEach((result) => {
    result.messages.forEach((message) => {
      const customSeverity = ruleSeverityMapping[message.ruleId || 'unknown'] || 0;
      details.push({
        ruleId: message.ruleId || 'unknown',
        severity: message.severity || 0,
        message: message.message || '',
        line: message.line || 0,
        column: message.column || 0,
        endLine: message.endLine,
        endColumn: message.endColumn,
        nodeType: message.nodeType,
        customSeverity: customSeverity,
      });

      if (message.severity === 2) {
        errors++;
      } else if (message.severity === 1) {
        warnings++;
      }
    });
  });

  return {
    summary: {
      dateCreated: new Date().toISOString().split('T')[0],
      timeCreated: new Date().toTimeString().split(' ')[0],
      activeWorkspace: vscode.workspace.name || 'Unknown',
      filepath: document.uri.fsPath,
      errors,
      warnings,
    },
    details,
  };
}

function createDiagnosticsFromLintResult(document: vscode.TextDocument, lintResult: LintResult): vscode.Diagnostic[] {
  return lintResult.details.map((issue) => {
    const range = new vscode.Range(
      new vscode.Position(issue.line - 1, issue.column - 1),
      new vscode.Position(
        issue.endLine ? issue.endLine - 1 : issue.line - 1,
        issue.endColumn || Number.MAX_SAFE_INTEGER
      )
    );

    const diagnostic = new vscode.Diagnostic(
      range,
      `${issue.message} (severity: ${issue.customSeverity})`,
      issue.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
    );
    (diagnostic as any).customSeverity = issue.customSeverity;

    return diagnostic;
  });
}

function saveLintResultToLibrary(lintResult: LintResult) {
  const resultsLibPath = path.join(extensionContext.extensionPath, 'resultsLib.json');
  let resultsLib = [];

  if (fs.existsSync(resultsLibPath)) {
    const existingData = fs.readFileSync(resultsLibPath, 'utf-8');
    resultsLib = JSON.parse(existingData);
  }
  //logical check for # of exsisting results, delete oldest if > 10
  if (resultsLib.length >= 10) {
    resultsLib.shift();
  }

  resultsLib.push(lintResult);

  fs.writeFileSync(resultsLibPath, JSON.stringify(resultsLib, null, 2));
}

async function saveLintResults() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    await lintDocument(editor.document, true);
    vscode.window.showInformationMessage('Lint results saved');
  } else {
    vscode.window.showInformationMessage('No active editor to lint and save results');
  }
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

// export function createDiagnosticsFromResults(
//   document: vscode.TextDocument,
//   results: ESLint.LintResult[]
// ): vscode.Diagnostic[] {
//   return results.flatMap((result) =>
//     result.messages.map((message) => {
//       const start = new vscode.Position(message.line - 1, message.column - 1);
//       const end = new vscode.Position(message.line - 1, Number.MAX_SAFE_INTEGER);
//       const range = new vscode.Range(start, end);

//       return new vscode.Diagnostic(
//         range,
//         message.message,
//         message.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
//       );
//     })
//   );
// }
