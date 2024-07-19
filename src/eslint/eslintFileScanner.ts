import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ESLint } from 'eslint';
import { ruleSeverityMapping } from './ruleSeverityMapping';

interface LintIssue {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  nodeType?: string;
  customSeverity?: number;
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
  // Initialize ESLint with custom configuration
  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfigFile: configFilePath || path.join(context.extensionPath, 'src/eslint/.eslintrc.accessibility.json'),
    resolvePluginsRelativeTo: context.extensionPath,
  });

  const lintResults: ESLint.LintResult[] = []; // Store results from ESLint
  const lintSummary = { errors: 0, warnings: 0 }; // Summary of ESLint results

  try {
    if (Array.isArray(files)) {
      // Handle array of file URIs
      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        if (document) {
          const fileResults = await eslint.lintText(document.getText(), { filePath: document.fileName });
          if (fileResults) {
            lintResults.push(...fileResults); // Add results into lintResults array
          }
        }
      }
    } else {
      const results = await eslint.lintText(files.getText(), { filePath: files.fileName });
      if (results) {
        lintResults.push(...results);
      }
      if (results) {
        lintResults.push(...results);
      }
    }

    const details: LintIssue[] = [];
    let filepath = '';

    // Loop through results
    for (const result of lintResults) {
      filepath += (filepath ? ', ' : '') + result.filePath;
      lintSummary.errors += result.errorCount || 0;
      lintSummary.warnings += result.warningCount || 0;
      filepath += (filepath ? ', ' : '') + result.filePath;
      lintSummary.errors += result.errorCount || 0;
      lintSummary.warnings += result.warningCount || 0;

      // Extract details from each error/warning
      if (result.messages) {
        for (const message of result.messages) {
          const customSeverity = ruleSeverityMapping[message.ruleId || 'unknown'] || 0;
          details.push({
            ruleId: message.ruleId || 'unknown',
            severity: message.severity || 0,
            message: message.message || '',
            line: message.line || 0,
            column: message.column || 0,
            endLine: message.endLine,
            endColumn: message.endColumn,
            nodeType: message.nodeType,
            customSeverity: customSeverity,
          });

          // console.log('custom severity ',customSeverity);
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

      const jsonResult = JSON.stringify(lintResult, null, 2); // Convert to JSON

      // Save to central JSON library
      const resultsLibPath = path.join(context.extensionPath, 'resultsLib.json');
      let resultsLib = [];

      if (fs.existsSync(resultsLibPath)) {
        // Read existing data if it exists
        const existingData = fs.readFileSync(resultsLibPath, 'utf-8');
        resultsLib = JSON.parse(existingData);
      }

      // Add new results
      resultsLib.push(lintResult);

      // Save updated data
      fs.writeFileSync(resultsLibPath, JSON.stringify(resultsLib, null, 2));

      // Show in VSCode notification message
      vscode.window.showInformationMessage(`ESLint results saved to: ${resultsLibPath}`);

      // Show results in output channel
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
