import * as vscode from 'vscode';
import * as path from 'path';
import { ESLint } from 'eslint';

let extensionContext: vscode.ExtensionContext;
const diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('jsx_eslint');

export function initializeEslintDiagnostics(context: vscode.ExtensionContext) {
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
