/* 
import * as vscode from 'vscode';
import { initializeLinting } from './eslint/eslintDiagnostics';
import { registerScanAllDocsCommand } from './commands/scanAllDocsCommand';
import { registerScanDocCommand } from './commands/scanDocCommand';
import { registerHighlightElementsCommand, registerToggleOffCommand } from './commands/highlightElementsCommand';
import { registerHoverProvider } from './commands/hoverProvider';
import { SidebarWebviewProvider } from './views/SidebarWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');

  const primarySidebarWebview = new SidebarWebviewProvider(context.extensionUri);
  const sidebarWebviewDisposable = vscode.window.registerWebviewViewProvider(
    SidebarWebviewProvider.viewType,
    primarySidebarWebview
  );

  registerScanDocCommand(context);
  registerScanAllDocsCommand(context);
  initializeLinting(context);
  registerHighlightElementsCommand(context);
  registerToggleOffCommand(context);
  registerHoverProvider(context);

  context.subscriptions.push(sidebarWebviewDisposable);
}

export function deactivate() {}
*/

import * as vscode from 'vscode';
import { registerScanFilesCommand } from './commands/scanFiles';
import { registerScanFilesWithCustomConfigCommand } from './commands/scanFiles';
// import { initializeEslintDiagnostics } from './eslint/eslintDiagnostics';
import { registerScanAllDocsCommand } from './commands/scanAllDocsCommand';
import { registerScanDocCommand } from './commands/scanDocCommand';
import { registerHighlightElementsCommand, registerToggleOffCommand } from './commands/highlightElementsCommand';
// import { registerDocumentEvents } from './commands/documentEvents';
import { registerHoverProvider } from './commands/hoverProvider';
import { SidebarWebviewProvider } from './views/SidebarWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');

  const primarySidebarWebview = new SidebarWebviewProvider(context.extensionUri);
  const sidebarWebviewDisposable = vscode.window.registerWebviewViewProvider(
    SidebarWebviewProvider.viewType,
    primarySidebarWebview
  );
  registerScanFilesCommand(context);
  registerScanFilesWithCustomConfigCommand(context);
  registerScanDocCommand(context);
  registerScanAllDocsCommand(context);
  //   initializeEslintDiagnostics(context);
  registerHighlightElementsCommand(context);
  registerToggleOffCommand(context);
  registerHoverProvider(context);

  context.subscriptions.push(sidebarWebviewDisposable);
}

export function deactivate(): any {}
