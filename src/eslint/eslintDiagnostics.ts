import * as vscode from 'vscode';
import * as path from 'path';
//import { ESLint } from 'eslint';
//import { ruleSeverityMapping } from './ruleSeverityMapping';
import { eslintScanFiles } from './eslintFileScanner';
import { runESLint } from './runESLint';
let extensionContext: vscode.ExtensionContext;
const diagnosticCollection = vscode.languages.createDiagnosticCollection('ludwig_eslint');

let statusBarItem: vscode.StatusBarItem;
let isActiveLintingEnabled = false;
let isAllFilesLintingEnabled = false;
// let currentLintedFile: vscode.Uri | undefined;

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
  registerGetResultsCommand(context);
  registerClearFileDiagnostics(context);
}

// export async function runESLint(document: vscode.TextDocument): Promise<ESLint.LintResult[]> {
//   const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
//   const userConfig = {};
//   // // to be used later for user-defined 'exclude wokspace' paths
//   // const workspacePath = workspaceFolder ? workspaceFolder.uri.fsPath : path.dirname(document.uri.fsPath);

//   const eslint = new ESLint({
//     useEslintrc: false,
//     overrideConfigFile: path.join(extensionContext.extensionPath, 'src/eslint/.eslintrc.accessibility.json'),
//     // removed overrideConfig that contained same settings as .eslintrc.accessibility.json
//     overrideConfig: userConfig,
//     resolvePluginsRelativeTo: extensionContext.extensionPath,
//   });

//   const text = document.getText();
//   const results = await eslint.lintText(text, {
//     filePath: document.fileName,
//   });
//   console.log(results);

//   return results;
// }

export async function setESLintDiagnostics() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const results = await eslintScanFiles([document.uri], extensionContext);
    if (results) {
      const diagnostics = createDiagnosticsFromLintResult(document, results);
      diagnosticCollection.set(document.uri, diagnostics);
      const fileName = path.basename(document.fileName);
      const numErrors = diagnostics.length;
      const message = `*${fileName}* processed successfully! ${numErrors} errors found.`;
      vscode.window.showInformationMessage(message);
    }
  }
}

export async function registerClearFileDiagnostics(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ludwig.clearDiagnostics', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      diagnosticCollection.delete(editor.document.uri);
      vscode.window.showInformationMessage('Diagnostics cleared for the current file.');
    }
  });

  context.subscriptions.push(disposable);
}

function createDiagnosticsFromLintResult(document: vscode.TextDocument, lintResult: LintResult): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  lintResult.details.forEach((issue) => {
    const range = new vscode.Range(
      new vscode.Position(issue.line - 1, issue.column - 1),
      new vscode.Position(issue.endLine ? issue.endLine - 1 : issue.line - 1, Number.MAX_SAFE_INTEGER)
    );

    const diagnostic = new vscode.Diagnostic(
      range,
      `${issue.message} (severity: ${issue.customSeverity})`,
      issue.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
    );
    (diagnostic as any).customSeverity = issue.customSeverity;

    diagnostics.push(diagnostic);
  });
  return diagnostics;
}

// function createDiagnosticsFromResults(
//   document: vscode.TextDocument,
//   results: ESLint.LintResult[]
// ): vscode.Diagnostic[] {
//   const diagnostics: vscode.Diagnostic[] = [];
//   results.forEach((result) => {
//     result.messages.forEach((message) => {
//       const range = new vscode.Range(
//         new vscode.Position(message.line - 1, message.column - 1),
//         new vscode.Position(message.line - 1, message.column)
//       );

//       const ruleId = message.ruleId || 'unknown-rule';
//       const customSeverity = ruleSeverityMapping[ruleId] || 1;

//       const diagnostic = new vscode.Diagnostic(
//         range,
//        `${message.message} (severity: ${customSeverity})`,
//         message.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
//       );
//       (diagnostic as any).customSeverity = customSeverity;

//       diagnostics.push(diagnostic);
//     });
//   });
//   return diagnostics;
// }
// Checks if command is already registered, otherwise it kept registering it at every activation event
async function registerGetResultsCommand(context: vscode.ExtensionContext) {
  const commandId = 'ludwig.getResults';
  const registeredCommands = await vscode.commands.getCommands();

  if (!registeredCommands.includes(commandId)) {
    const disposable = vscode.commands.registerCommand(commandId, setESLintDiagnostics);
    context.subscriptions.push(disposable);
  }
}


/*
import * as vscode from 'vscode';
import * as path from 'path';
//import { ESLint } from 'eslint';
//import { ruleSeverityMapping } from './ruleSeverityMapping';
import { eslintScanFiles } from './eslintFileScanner';
import { runESLint } from './runESLint';
let extensionContext: vscode.ExtensionContext;
const diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('jsx_eslint');

export function initializeLinting(context: vscode.ExtensionContext) {
  extensionContext = context;
  registerGetResultsCommand(context);
  registerClearFileDiagnostics(context);
}

export async function runESLint(document: vscode.TextDocument): Promise<ESLint.LintResult[]> {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const userConfig = {};
  // // to be used later for user-defined 'exclude wokspace' paths
  // const workspacePath = workspaceFolder ? workspaceFolder.uri.fsPath : path.dirname(document.uri.fsPath);

  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfigFile: path.join(extensionContext.extensionPath, 'src/eslint/.eslintrc.accessibility.json'),
    // removed overrideConfig that contained same settings as .eslintrc.accessibility.json
    overrideConfig: userConfig,
    resolvePluginsRelativeTo: extensionContext.extensionPath,
  });

  const text = document.getText();
  const results = await eslint.lintText(text, {
    filePath: document.fileName,
  });
  console.log(results);

  return results;
}

export async function setESLintDiagnostics() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const results = await runESLint(document);
    const diagnostics = createDiagnosticsFromResults(document, results);
    diagnosticCollection.set(document.uri, diagnostics);
    const fileName = path.basename(document.fileName);
    const numErrors = diagnostics.length;
    const message = `*${fileName}* processed successfully! ${numErrors} errors found.`;
    vscode.window.showInformationMessage(message);
  }
}

export async function registerClearFileDiagnostics(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('ludwig.clearDiagnostics', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      diagnosticCollection.delete(editor.document.uri);
      vscode.window.showInformationMessage('Diagnostics cleared for the current file.');
    }
  });

  context.subscriptions.push(disposable);
}

function createDiagnosticsFromResults(
  document: vscode.TextDocument,
  results: ESLint.LintResult[]
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  results.forEach((result) => {
    result.messages.forEach((message) => {
      const range = new vscode.Range(
        new vscode.Position(message.line - 1, message.column - 1),
        new vscode.Position(message.line - 1, Number.MAX_SAFE_INTEGER),
      );
      const diagnostic = new vscode.Diagnostic(
        range,
        message.message,
        message.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
      );
      diagnostics.push(diagnostic);
    });
  });
  return diagnostics;
}
// Checks if command is already registered, otherwise it kept registering it at every activation event
async function registerGetResultsCommand(context: vscode.ExtensionContext) {
  const commandId = 'ludwig.getResults';
  const registeredCommands = await vscode.commands.getCommands();

  if (!registeredCommands.includes(commandId)) {
    const disposable = vscode.commands.registerCommand(commandId, setESLintDiagnostics);
    context.subscriptions.push(disposable);
  }
}

*/