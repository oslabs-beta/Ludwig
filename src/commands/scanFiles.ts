import * as vscode from 'vscode';
import { eslintScanFiles } from '../eslint/eslintFileScanner';

export function registerScanFilesCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ludwig.scanFiles', handleScanFiles(context));
  context.subscriptions.push(disposable);
  console.log('ludwig.scanFiles command registered');
}

export function registerScanFilesWithCustomConfigCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'ludwig.scanFilesWithCustomConfig',
    handleScanFilesWithCustomConfig(context)
  );
  context.subscriptions.push(disposable);
  console.log('ludwig.scanFilesWithCustomConfig command registered');
}

function handleScanFiles(context: vscode.ExtensionContext) {
  return async (uriOrUris: vscode.Uri | vscode.Uri[] | undefined) => {
    await scanFiles(context, uriOrUris);
  };
}

function handleScanFilesWithCustomConfig(context: vscode.ExtensionContext) {
  return async (uriOrUris: vscode.Uri | vscode.Uri[] | undefined) => {
    const configOptions = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Select ESLint Config File',
      filters: {
        'JSON files': ['json'],
      },
    });

    if (configOptions && configOptions[0]) {
      const configPath = configOptions[0].fsPath;
      await scanFiles(context, uriOrUris, configPath);
    } else {
      vscode.window.showErrorMessage('No config file selected. Using default configuration.');
      await scanFiles(context, uriOrUris);
    }
  };
}

async function scanFiles(
  context: vscode.ExtensionContext,
  uriOrUris: vscode.Uri | vscode.Uri[] | undefined,
  configFile?: string
) {
  try {
    let results;
    if (!uriOrUris) {
      // If no file is provided, use the active editor
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        results = await eslintScanFiles(activeEditor.document, context, configFile);
      } else {
        vscode.window.showErrorMessage('No active file to scan.');
        return;
      }
    } else {
      results = await eslintScanFiles(Array.isArray(uriOrUris) ? uriOrUris : [uriOrUris], context, configFile);
    }

    if (results) {
      vscode.window.showInformationMessage(
        `Scan complete. Errors: ${results.summary.errors}, Warnings: ${results.summary.warnings}`
      );
      // You can add more detailed processing here if needed
      console.log('Detailed results:', results);
    } else {
      vscode.window.showInformationMessage('No issues found in scanned files.');
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error during scan: ${error.message}`);
  }
}
