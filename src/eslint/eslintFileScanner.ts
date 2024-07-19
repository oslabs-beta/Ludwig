import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ESLint } from 'eslint';

interface LintIssue {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  nodeType?: string;
}

interface LintResult {
  summary: {
    dateCreated: string;
    timeCreated: string;
    activeWorkspace: string;
    filepath: string;
    errors: number;
    warnings: number;
  };
  details: LintIssue[];
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
        if (document) {
          const fileResults = await eslint.lintText(document.getText(), { filePath: document.fileName });
          if (fileResults) {
            lintResults.push(...fileResults);
          }
        }
      }
    } else {
      const results = await eslint.lintText(files.getText(), { filePath: files.fileName });
      if (results) {
        lintResults.push(...results);
      }
    }

    const details: LintIssue[] = [];
    let filepath = '';

    for (const result of lintResults) {
      filepath += (filepath ? ', ' : '') + result.filePath;
      lintSummary.errors += result.errorCount || 0;
      lintSummary.warnings += result.warningCount || 0;

      if (result.messages) {
        for (const message of result.messages) {
          details.push({
            ruleId: message.ruleId || 'unknown',
            severity: message.severity || 0,
            message: message.message || '',
            line: message.line || 0,
            column: message.column || 0,
            endLine: message.endLine,
            endColumn: message.endColumn,
            nodeType: message.nodeType,
          });
        }
      }
    }

    if (lintSummary.errors > 0 || lintSummary.warnings > 0) {
      const lintResult: LintResult = {
        summary: {
          dateCreated: new Date().toISOString().split('T')[0],
          timeCreated: new Date().toTimeString().split(' ')[0],
          activeWorkspace: vscode.workspace.name || 'Unknown',
          filepath,
          errors: lintSummary.errors,
          warnings: lintSummary.warnings,
        },
        details,
      };

      const jsonResult = JSON.stringify(lintResult, null, 2);

      // save to file
      const outputPath = path.join(
        context.extensionPath,
        'ludwigReports',
        `${lintResult.summary.timeCreated} ludwig-report.json`
      );
      fs.writeFileSync(outputPath, jsonResult);
      vscode.window.showInformationMessage(`ESLint results saved to: ${outputPath}`);

      //show in output channel
      const outputChannel = vscode.window.createOutputChannel('ESLint Results');
      outputChannel.show();
      outputChannel.appendLine(jsonResult);

      return lintResult;
    }
    return null;
  } catch (error: any) {
    if (error.message) {
      throw new Error(`Linting failed: ${error.message}`);
    } else {
      throw new Error('Linting failed');
    }
  }
}
