import * as vscode from 'vscode';
import * as path from 'path';

let dashboard: vscode.WebviewPanel | undefined;

export function createDonutDashboard(context: vscode.ExtensionContext): vscode.WebviewPanel {
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
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'doughnutChart.js'))
  );

  dashboard.webview.html = getWebviewContent(scriptUri);

  dashboard.onDidDispose(
    () => {
      dashboard = undefined;
    },
    null,
    context.subscriptions
  );
  return dashboard;
}

function getWebviewContent(scriptUri: vscode.Uri): string {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ESLint Rules Doughnut Chart</title>
</head>
<body>
    <div style="width: 80%; margin: auto;">
        <canvas id="eslintChart"></canvas>
    </div>

    <script src="${scriptUri}"></script>
    <script>
        // Your chart initialization code here
    </script>
</body>
</html>
  `;
}
