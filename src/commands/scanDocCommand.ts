import * as vscode from 'vscode';
import { createDashboard } from '../utils/createDashboard';
import { getAccessScore } from '../logic/access-score';
import { compileLogic } from '../logic/logicCompiler';

export function registerScanDocCommand(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'ludwig.scanDoc',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor || activeEditor.document.languageId !== 'html') {
        return vscode.window.showInformationMessage(
          'Activate an HTML document first'
        );
      } else {
        vscode.window.showInformationMessage('Scan In Progress...');
      }

      const [ariaRecs, scoreData] = await Promise.all([
        compileLogic(activeEditor),
        getAccessScore(await compileLogic(activeEditor)),
      ]);

      const panel = createDashboard(context);
      panel.webview.postMessage({ data: ariaRecs, recData: scoreData });
      vscode.window.showInformationMessage('Scan complete!');
    }
  );
  context.subscriptions.push(disposable);
}
