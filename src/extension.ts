import * as vscode from 'vscode';
import { initializeLinting } from './eslint/eslintDiagnostics';
import { SidebarWebviewProvider } from './views/SidebarWebviewProvider';
// import { createChartDashboard } from './utils/chartDashboard';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');

  const primarySidebarWebview = new SidebarWebviewProvider(context.extensionUri);
  const sidebarWebviewDisposable = vscode.window.registerWebviewViewProvider(
    SidebarWebviewProvider.viewType,
    primarySidebarWebview
  );

  initializeLinting(context);

  // context.subscriptions.push(
  //   vscode.commands.registerCommand('ludwig.showDashboard', () => {
  //     createChartDashboard(context);
  //   })
  // );

  context.subscriptions.push(sidebarWebviewDisposable);
}

export function deactivate() {}
