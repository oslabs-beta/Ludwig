import * as vscode from 'vscode';
import * as path from 'path';
import { ESLint } from 'eslint';

// let extensionContext: vscode.ExtensionContext;
type SupportedLanguage = 'html' | 'javascriptreact' | 'typescriptreact';

export async function runESLint(
  document: vscode.TextDocument,
  context: vscode.ExtensionContext
): Promise<ESLint.LintResult[] | null> {
  const supportedLanguages: SupportedLanguage[] = ['html', 'javascriptreact', 'typescriptreact'];

  if (!supportedLanguages.includes(document.languageId as SupportedLanguage)) {
    console.log(`Language ${document.languageId} is not supported for linting.`);
    return null;
  }

  const configFileMap: Record<SupportedLanguage, string> = {
    html: 'eslintrc.html.json',
    javascriptreact: 'eslintrc.jsx.json',
    typescriptreact: 'eslintrc.jsx.json',
  };

  const configFileName = configFileMap[document.languageId as SupportedLanguage];
  const configFilePath = path.join(context.extensionPath, 'dist', 'eslint', 'configs', configFileName);

  // Get user settings
  const config = vscode.workspace.getConfiguration('ludwig');
  const userConfig = config.get(`eslintConfig.${document.languageId}`) || {};

  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfigFile: configFilePath,
    overrideConfig: userConfig,
    resolvePluginsRelativeTo: context.extensionPath,
  });

  const text = document.getText();
  const results = await eslint.lintText(text, {
    filePath: document.fileName,
  });
  console.log(results);

  return results;
}
