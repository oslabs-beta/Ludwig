import * as vscode from 'vscode';
import { provideHover } from '../utils/highlightElements';

export function registerHoverProvider(context: vscode.ExtensionContext) {
  const hoverProviderDisposable = vscode.languages.registerHoverProvider(
    { scheme: 'file', language: 'html' },
    {
      provideHover(document, position) {
        return provideHover(document, position);
      },
    }
  );

  context.subscriptions.push(hoverProviderDisposable);
}
