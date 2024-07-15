import * as vscode from 'vscode';
import * as path from 'path';
import { ESLint } from 'eslint';

export async function eslintScanFiles(
  files: vscode.Uri[] | vscode.TextDocument,
  context: vscode.ExtensionContext,
  configFile?: string
) {
  const eslintInstance = new ESLint({
    useEslintrc: false,
    overrideConfigFile: configFile || path.join(context.extensionPath, 'src/eslint/.eslintrc.accessibility.json'),
    resolvePluginsRelativeTo: context.extensionPath,
  });

  const outputObj: { [key: string]: any } = {};
  let summary: {
    errors: number;
    warnings: number;
  } = { errors: 0, warnings: 0 };

  let results: ESLint.LintResult[] = [];

  if (Array.isArray(files)) {
    for (const file of files) {
      const document = await vscode.workspace.openTextDocument(file);
      const fileResults = await eslintInstance.lintText(document.getText(), {
        filePath: document.fileName,
      });
      results = results.concat(fileResults);
    }
  } else {
    // Handle single TextDocument
    results = await eslintInstance.lintText(files.getText(), {
      filePath: files.fileName,
    });
  }

  results.forEach((result: any) => {
    // console.log("el.messages: ", el.messages)
    // console.log('mess: ', mess);
    const filePath = path.basename(result.filePath);
    result.messages.forEach((message: any) => {
      // Create a unique key for each lint message
      const keyname = `${filePath}--${message.line}:${message.column}`;
      if (!outputObj[keyname]) {
        outputObj[keyname] = message;
      }
    });
    summary.errors += result.errorCount;
    summary.warnings += result.warningCount;
    console.log('eslintScanFiles output: ', outputObj);
    if (summary.errors > 0 || summary.warnings > 0) {
      return {
        summary: `Errors: ${summary.errors}, Warnings: ${summary.warnings}`,
        details: outputObj,
      };
    }
    //when no errors or warnings are found
    return null;
  });
}
