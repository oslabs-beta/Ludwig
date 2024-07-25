import * as vscode from 'vscode';
import * as path from 'path';

let dashboard: vscode.WebviewPanel | undefined;

export function createChartDashboard(context: vscode.ExtensionContext): vscode.WebviewPanel {
  if (dashboard) {
    dashboard.reveal(vscode.ViewColumn.Two);
    return dashboard;
  }

  dashboard = vscode.window.createWebviewPanel('ludwig-dashboard', 'Ludwig Dashboard', vscode.ViewColumn.Two, {
    enableScripts: true,
    retainContextWhenHidden: true,

    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))],
  });

  const scriptUri = dashboard.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'progressionChart.js'))
  );
  const cssUri = dashboard.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'dashboard.css'))
  );

  dashboard.webview.html = getWebviewContent(scriptUri, cssUri);

  dashboard.onDidDispose(
    () => {
      dashboard = undefined;
    },
    null,
    context.subscriptions
  );
  return dashboard;
}

function getWebviewContent(scriptUri: vscode.Uri, cssUri: vscode.Uri): string {
  return `
 <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${cssUri}" rel="stylesheet">
      <title>Main Dashboard</title>
    </head>
    <body>
      <div id="root"></div>
      <canvas id="progressionChart"></canvas>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
