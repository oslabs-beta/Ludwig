import * as vscode from 'vscode';
import { initializeLinting } from './eslint/eslintDiagnostics';
import { SidebarWebviewProvider } from './views/SidebarWebviewProvider';
// import { registerHighlightElementsCommand, registerToggleOffCommand } from './commands/highlightElementsCommand';
// import { registerHoverProvider } from './commands/hoverProvider';
// import { registerScanFilesCommand } from './commands/scanFiles';
// import { registerScanFilesWithCustomConfigCommand } from './commands/scanFiles';
// import { initializeEslintDiagnostics } from './eslint/eslintDiagnostics';
// import { registerDocumentEvents } from './commands/documentEvents';
// import { registerResetLibraryCommand } from './commands/libraryCommands';
// import { createDashboard } from './utils/createDashboard';
import { createDonutDashboard } from './utils/donutDashboard';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');

  const primarySidebarWebview = new SidebarWebviewProvider(context.extensionUri);
  const sidebarWebviewDisposable = vscode.window.registerWebviewViewProvider(
    SidebarWebviewProvider.viewType,
    primarySidebarWebview
  );

  initializeLinting(context);
  // // registerResetLibraryCommand(context);
  // context.subscriptions.push(
  //   vscode.commands.registerCommand('ludwig.showDashboard', () => {
  //     createDashboard(context);
  //   })
  // );
  context.subscriptions.push(
    vscode.commands.registerCommand('ludwig.showDashboard', () => {
      createDonutDashboard(context);
    })
  );
  // registerHighlightElementsCommand(context);
  // registerToggleOffCommand(context);
  // registerHoverProvider(context);
  // registerScanFilesCommand(context);
  // registerScanFilesWithCustomConfigCommand(context);
  // initializeEslintDiagnostics(context);

  context.subscriptions.push(sidebarWebviewDisposable);
}

export function deactivate() {}
