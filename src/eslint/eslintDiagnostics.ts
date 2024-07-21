import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ESLint } from 'eslint';
import { runESLint } from './runESLint';
// import { simpleLintResultHash } from '../utils/simpleLintResultHash';
import { ruleSeverityMapping } from './ruleSeverityMapping';
import { createDashboard } from '../utils/createDashboard';

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

  // _currentLintedFile = document.uri;
  const fileName = path.basename(document.fileName);
  try {
    const results = await runESLint(document, extensionContext);
    if (results !== null) {
      const lintResult = createLintResultFromESLintResults(document, results);
      const diagnostics = createDiagnosticsFromLintResult(document, lintResult);
      diagnosticCollection.set(document.uri, diagnostics);

      // Save results to central JSON library
      if (saveResults) {
        saveLintResultToLibrary(lintResult, document);
        updateDashboard(lintResult);

        //dont want to add to dashboard while in lint ALL FILES mode
      }
      // const dashboard = createDashboard(extensionContext);
      // dashboard.webview.postMessage({ command: 'updateErrors', errorCount: lintResult.summary.errors });

      const numIssues = lintResult.details.length;
      showTemporaryInfoMessage(`*${fileName}* processed successfully! ${numIssues} issues found.`);
      updateStatusBarItem();
      return lintResult;
    }
  } catch (error) {
    console.error(`Linting failed for ${fileName}:`, error);
    diagnosticCollection.delete(document.uri);
    showTemporaryInfoMessage(`Linting failed for ${fileName}`);
    updateStatusBarItem();
    return null;
  }
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

// Helper function to create a safe file name based on the document's URI
function createSafeFileName(document: vscode.TextDocument): string {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const relativePath = workspaceFolder
    ? path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath)
    : document.uri.fsPath;
  const sanitizedPath = relativePath.replace(/[\\/:]/g, '_'); // Replace path separators with underscores
  return sanitizedPath + '.json';
}

function simpleLintResultHash(lintResult: LintResult): string {
  // Create a string representation of the important parts of the lint result
  const relevantData = `${lintResult.summary.errors}-${lintResult.summary.warnings}-${lintResult.details
    .map((d) => `${d.ruleId}-${d.severity}-${d.message}`)
    .sort()
    .join('|')}`;

  // Use a simple hash function
  let hash = 0;
  for (let i = 0; i < relevantData.length; i++) {
    const char = relevantData.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Return the hash as a string
  return hash.toString(16);
}

interface HashedLintResult extends LintResult {
  hash: string;
}

async function saveLintResultToLibrary(lintResult: LintResult, document: vscode.TextDocument) {
  const resultsDir = path.join(extensionContext.extensionPath, 'Summary_Library');
  console.log('Saving lint result to library...');
  console.log('Results directory:', resultsDir);

  try {
    await fs.mkdir(resultsDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create results directory:', error);
    return;
  }

  const fileName = createSafeFileName(document);
  const resultsFilePath = path.join(resultsDir, fileName);
  console.log('Results file path:', resultsFilePath);

  let resultsLib = [];
  try {
    const existingData = await fs.readFile(resultsFilePath, 'utf-8');
    resultsLib = JSON.parse(existingData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Failed to read results file:', error);
      return;
    }
    console.log('No existing results file found. Creating a new one.');
  }
  const newHashedResult: HashedLintResult = {
    ...lintResult,
    hash: simpleLintResultHash(lintResult),
  };
  console.log('New hashed lint result:', newHashedResult);

  if (resultsLib.length > 0 && resultsLib[resultsLib.length - 1].hash === newHashedResult.hash) {
    console.log('Lint results unchanged. Skipping save operation.');
    return;
  }

  if (resultsLib.length >= 10) {
    resultsLib.shift();
  }
  resultsLib.push(newHashedResult);
  console.log('Updated results library:', resultsLib);

  try {
    await fs.writeFile(resultsFilePath, JSON.stringify(resultsLib, null, 2));
    console.log(`${resultsFilePath}:  Lint results saved successfully.`);
    await updateDashboard(lintResult);
  } catch (error) {
    console.error('Failed to write lint results:', error);
  }
}
async function saveLintResults() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const lintResult = await lintDocument(editor.document, true);
    if (lintResult) {
      updateDashboard(lintResult);
      vscode.window.showInformationMessage('Lint results saved');
      console.log('Lint results saved and updated dashboard');
    } else {
      vscode.window.showInformationMessage('No active editor to lint and save results');
    }
  }
}

async function updateDashboard(lintResult: LintResult) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    console.error('No active editor to update dashboard');
    return;
  }

  const currentFile = editor.document.uri.fsPath;
  const resultsLibDir = path.join(extensionContext.extensionPath, 'Summary_Library');
  const fileName = createSafeFileName(editor.document);
  const resultsLibPath = path.join(resultsLibDir, fileName);

  let recentResults: HashedLintResult[] = [];
  try {
    const data = await fs.readFile(resultsLibPath, 'utf-8');
    recentResults = JSON.parse(data);
  } catch (error) {
    console.error('Error reading results file:', error);
    // If there's an error reading the file, we'll start with an empty array
    recentResults = [];
  }

  // Add the current lintResult to recentResults
  const currentHashedResult: HashedLintResult = {
    ...lintResult,
    hash: simpleLintResultHash(lintResult),
  };

  // Only add the current result if it's different from the last one
  if (recentResults.length === 0 || recentResults[recentResults.length - 1].hash !== currentHashedResult.hash) {
    recentResults.push(currentHashedResult);
    // Keep only the last 10 results
    recentResults = recentResults.slice(-10);
  }

  // Format data for the chart
  const chartData = {
    labels: recentResults.map((result) => result.summary.timeCreated),
    errorCounts: recentResults.map((result) => result.summary.errors),
    warnings: recentResults.map((result) => result.summary.warnings),
  };

  const dashboard = createDashboard(extensionContext);
  dashboard.webview.postMessage({
    command: 'loadData',
    fileName: path.basename(currentFile),
    data: chartData,
  });

  console.log('Dashboard updated with latest data');
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
    await lintDocument(editor.document, true);
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
