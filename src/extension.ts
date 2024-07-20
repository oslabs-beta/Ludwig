import * as vscode from 'vscode';
import { initializeLinting } from './eslint/eslintDiagnostics';
import { SidebarWebviewProvider } from './views/SidebarWebviewProvider';
// import { registerHighlightElementsCommand, registerToggleOffCommand } from './commands/highlightElementsCommand';
// import { registerHoverProvider } from './commands/hoverProvider';
// import { registerScanFilesCommand } from './commands/scanFiles';
// import { registerScanFilesWithCustomConfigCommand } from './commands/scanFiles';
// import { initializeEslintDiagnostics } from './eslint/eslintDiagnostics';
// import { registerDocumentEvents } from './commands/documentEvents';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');

  const primarySidebarWebview = new SidebarWebviewProvider(context.extensionUri);
  const sidebarWebviewDisposable = vscode.window.registerWebviewViewProvider(
    SidebarWebviewProvider.viewType,
    primarySidebarWebview
  );

  initializeLinting(context);
  // registerHighlightElementsCommand(context);
  // registerToggleOffCommand(context);
  // registerHoverProvider(context);
  // registerScanFilesCommand(context);
  // registerScanFilesWithCustomConfigCommand(context);
  // initializeEslintDiagnostics(context);

  context.subscriptions.push(sidebarWebviewDisposable);
}

export function deactivate() {}
