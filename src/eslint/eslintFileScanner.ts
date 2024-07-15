import * as vscode from 'vscode';
import * as path from 'path';
import { ESLint } from 'eslint';

interface LintResult {
  summary: {
    errors: number;
    warnings: number;
  };
  details: { [key: string]: any };
}

export async function eslintScanFiles(
  files: vscode.Uri[] | vscode.TextDocument,
  context: vscode.ExtensionContext,
  configFilePath?: string
): Promise<LintResult | null> {
  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfigFile: configFilePath || path.join(context.extensionPath, 'src/eslint/.eslintrc.accessibility.json'),
    resolvePluginsRelativeTo: context.extensionPath,
  });

  const lintResults: ESLint.LintResult[] = [];
  const lintSummary = { errors: 0, warnings: 0 };

  try {
    if (Array.isArray(files)) {
      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const fileResults = await eslint.lintText(document.getText(), { filePath: document.fileName });
        lintResults.push(...fileResults);
      }
    } else {
      const results = await eslint.lintText(files.getText(), { filePath: files.fileName });
      lintResults.push(...results);
    }

    const lintDetails: { [key: string]: any } = {};
    for (const result of lintResults) {
      const filePath = path.basename(result.filePath);
      for (const message of result.messages) {
        const key = `${filePath}--${message.line}:${message.column}`;
        if (!lintDetails[key]) {
          lintDetails[key] = message;
        }
      }
      lintSummary.errors += result.errorCount;
      lintSummary.warnings += result.warningCount;
    }

    if (lintSummary.errors > 0 || lintSummary.warnings > 0) {
      return { summary: lintSummary, details: lintDetails };
    }
    return null;
  } catch (error: any) {
    throw new Error(`Linting failed: ${error.message}`);
  }
}
