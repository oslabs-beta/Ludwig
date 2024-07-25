import * as vscode from 'vscode';

type MessageType = 'info' | 'warning' | 'error';

export function showMessage(message: string, type: MessageType = 'info', duration?: number): void {
  if (duration) {
    const statusBarMessage = vscode.window.setStatusBarMessage(message, duration);
    setTimeout(() => statusBarMessage.dispose(), duration);
  } else {
    switch (type) {
      case 'info':
        vscode.window.showInformationMessage(message);
        break;
      case 'warning':
        vscode.window.showWarningMessage(message);
        break;
      case 'error':
        vscode.window.showErrorMessage(message);
        break;
    }
  }
}

export function showTemporaryInfoMessage(message: string, duration: number = 3000): void {
  showMessage(message, 'info', duration);
}
