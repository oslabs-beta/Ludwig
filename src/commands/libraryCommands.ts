import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerResetLibraryCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ludwig.resetLib', () => {
    vscode.window.showInformationMessage('Resetting Local Library...');

    //check if resultsLib.json exists
    const resultsLibPath = path.join(context.extensionPath, 'resultsLib.json');
    if (fs.existsSync(resultsLibPath)) {
      //delete resultsLib.json
      fs.unlinkSync(resultsLibPath);
      vscode.window.showInformationMessage('Local Library Reset Successful!');
    } else {
      //if no libary exists, show error
      vscode.window.showInformationMessage('No Local Library Found!');
    }
  });

  context.subscriptions.push(disposable);
}
