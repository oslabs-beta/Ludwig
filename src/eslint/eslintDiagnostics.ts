import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ESLint } from 'eslint';
import { runESLint } from './runESLint';
import { ruleSeverityMapping } from './ruleSeverityMapping';
import { createChartDashboard } from '../utils/chartDashboard';
import { createDonutDashboard } from '../utils/donutDashboard';
import { compileLogic } from '../logic/logicCompiler';

const diagnosticCollection = vscode.languages.createDiagnosticCollection('ludwig_eslint');
let extensionContext: vscode.ExtensionContext;
let lintingTimeout: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;
let isAllFilesLintingEnabled = false;
let isActiveLintingEnabled = false;

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

export function initializeLinting(context: vscode.ExtensionContext) {
  extensionContext = context;
  context.subscriptions.push(
    vscode.commands.registerCommand('ludwig.toggleLintActiveFile', toggleLintActiveFile),
    vscode.commands.registerCommand('ludwig.updateDashboard', updateDashboardCommand),
    vscode.commands.registerCommand('ludwig.toggleLintAllFiles', toggleLintAllFiles),
    vscode.commands.registerCommand('ludwig.clearDiagnostics', clearDiagnostics),
    vscode.commands.registerCommand('ludwig.showLintingMenu', showLintingMenu),
    vscode.commands.registerCommand('ludwig.saveLintResults', saveLintResults),
    vscode.commands.registerCommand('ludwig.resetLib', resetLib)
  );

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'ludwig.showLintingMenu';
  context.subscriptions.push(statusBarItem);
  updateStatusBarItem();

  vscode.workspace.onDidSaveTextDocument(async (document) => {
    console.log('onDidSaveTextDocument');
    let lintResult;

    if (isAllFilesLintingEnabled || isActiveLintingEnabled) {
      lintResult = await lintDocument(document);
      if (lintResult) {
        await saveLintResultToLibrary(lintResult, document);
      }
    }
  });

  vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
    console.log('onDidChangeTextDocument');
    if (isActiveLintingEnabled && event.document === vscode.window.activeTextEditor?.document) {
      if (lintingTimeout) {
        clearTimeout(lintingTimeout);
      }

      lintingTimeout = setTimeout(() => {
        lintDocument(event.document);
      }, 2000);
    }
  });

  vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    console.log('onDidChangeActiveTextEditor');
    updateStatusBarItem();
    if (editor && isActiveLintingEnabled) {
      await lintDocument(editor.document);
    }
  });

  async function lintDocument(document: vscode.TextDocument, saveResults: boolean = false) {
    // ...
    if (!isAllFilesLintingEnabled) {
      diagnosticCollection.clear();
    }

    // _currentLintedFile = document.uri;
    const fileName = path.basename(document.fileName);
    console.log(`Linting ${fileName}`);

    try {
      if (document.languageId === 'html') {
        const lintResult = await compileLogic(document);
        console.log('line 104');
        const diagnostics = createDiagnosticsFromLintResult(document, lintResult);
        diagnosticCollection.set(document.uri, diagnostics);
        const numIssues = lintResult.details.length;
        showTemporaryInfoMessage(`*${fileName}* processed successfully! ${numIssues} issues found.`);
        console.log(`Finished linting ${fileName} with ${numIssues} issues`);
        return lintResult;
      }
      const results = await runESLint(document, extensionContext);
      console.log(`Linting ${fileName} completed. Number of issues: ${results?.length}`);
      if (results !== null) {
        const lintResult = createLintResultFromESLintResults(document, results);
        const diagnostics = createDiagnosticsFromLintResult(document, lintResult);
        diagnosticCollection.set(document.uri, diagnostics);

        // Save results to central JSON library
        if (saveResults) {
          saveLintResultToLibrary(lintResult, document);
        }

        const numIssues = lintResult.details.length;
        showTemporaryInfoMessage(`*${fileName}* processed successfully! ${numIssues} issues found.`);
        console.log(`Finished linting ${fileName} with ${numIssues} issues`);
        return lintResult;
      }
    } catch (error) {
      console.error(`Linting failed for ${fileName}:`, error);
      diagnosticCollection.delete(document.uri);
      showTemporaryInfoMessage(`Linting failed for ${fileName}`);
      return null;
    }
  }

  function createLintResultFromESLintResults(document: vscode.TextDocument, results: ESLint.LintResult[]): LintResult {
    const details: LintIssue[] = [];
    let errors = 0;
    let warnings = 0;

    results.forEach((result) => {
      result.messages.forEach((message) => {
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

        if (message.severity === 2) {
          errors++;
        } else if (message.severity === 1) {
          warnings++;
        }
      });
    });

    return {
      summary: {
        dateCreated: new Date().toISOString().split('T')[0],
        timeCreated: new Date().toTimeString().split(' ')[0],
        activeWorkspace: vscode.workspace.name || 'Unknown',
        filepath: document.uri.fsPath,
        errors,
        warnings,
      },
      details,
    };
  }

  function createDiagnosticsFromLintResult(document: vscode.TextDocument, lintResult: LintResult): vscode.Diagnostic[] {
    return lintResult.details.map((issue) => {
      const range = new vscode.Range(
        new vscode.Position(issue.line - 1, issue.column - 1),
        new vscode.Position(
          issue.endLine ? issue.endLine - 1 : issue.line - 1,
          issue.endColumn || Number.MAX_SAFE_INTEGER
        )
      );
      let diagnosisMessage = `${issue.message} (severity: ${issue.customSeverity})`;

      if (document.languageId === 'html') {
        diagnosisMessage = `${issue.message}`;
      }
      const diagnostic = new vscode.Diagnostic(
        range,
        diagnosisMessage,
        issue.severity === 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
      );
      (diagnostic as any).customSeverity = issue.customSeverity;

      return diagnostic;
    });
  }

  // Helper function to create a safe file name based on the document's URI
  function createSafeFileName(document: vscode.TextDocument): string {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const relativePath = workspaceFolder
      ? path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath)
      : document.uri.fsPath;
    const sanitizedPath = relativePath.replace(/[\\/:]/g, '_'); // Replace path separators with underscores
    return sanitizedPath + '.json';
  }

  function simpleLintResultHash(lintResult: LintResult): string {
    // Create a string representation of the important parts of the lint result
    const relevantData = `${lintResult.summary.errors}-${lintResult.summary.warnings}-${lintResult.details
      .map((d) => `${d.ruleId}-${d.severity}-${d.message}`)
      .sort()
      .join('|')}`;

    // Use a simple hash function
    let hash = 0;
    for (let i = 0; i < relevantData.length; i++) {
      const char = relevantData.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Return the hash as a string
    return hash.toString(16);
  }

  interface HashedLintResult extends LintResult {
    hash: string;
  }

  async function saveLintResultToLibrary(lintResult: LintResult, document: vscode.TextDocument) {
    const resultsDir = path.join(extensionContext.extensionPath, 'Summary_Library');
    console.log('Saving lint result to library...');
    console.log('Results directory:', resultsDir);

    try {
      await fs.mkdir(resultsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create results directory:', error);
      return;
    }

    const fileName = createSafeFileName(document);
    const resultsFilePath = path.join(resultsDir, fileName);
    console.log('Results file path:', resultsFilePath);

    let resultsLib = [];
    try {
      const existingData = await fs.readFile(resultsFilePath, 'utf-8');
      resultsLib = JSON.parse(existingData);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Failed to read results file:', error);
        return;
      }
      console.log('No existing results file found. Creating a new one.');
    }
    const newHashedResult: HashedLintResult = {
      ...lintResult,
      hash: simpleLintResultHash(lintResult),
    };
    console.log('New hashed lint result:', newHashedResult);

    if (resultsLib.length > 0 && resultsLib[resultsLib.length - 1].hash === newHashedResult.hash) {
      console.log('Lint results unchanged. Skipping save operation.');
      return;
    }

    if (resultsLib.length >= 10) {
      resultsLib.shift();
    }
    resultsLib.push(newHashedResult);
    console.log('Updated results library:', resultsLib);

    try {
      await fs.writeFile(resultsFilePath, JSON.stringify(resultsLib, null, 2));
      console.log(`${resultsFilePath}:  Lint results saved successfully.`);
      // await updateDashboard(lintResult);
    } catch (error) {
      console.error('Failed to write lint results:', error);
    }
  }
  async function saveLintResults() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const lintResult = await lintDocument(editor.document, true);
      if (lintResult) {
        vscode.window.showInformationMessage('Results saved successfully');
      } else {
        vscode.window.showInformationMessage('No active editor to lint and save results');
      }
    }
  }

  async function updateDashboardCommand(chartType: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active editor to update dashboard');
      return;
    }

    const document = editor.document;
    const fileName = createSafeFileName(document);
    const resultsFilePath = path.join(extensionContext.extensionPath, 'Summary_Library', fileName);

    try {
      const data = await fs.readFile(resultsFilePath, 'utf-8');
      const resultsLib = JSON.parse(data);
      if (resultsLib.length > 0) {
        const latestResult = resultsLib[resultsLib.length - 1];
        await updateDashboard(latestResult, chartType);
        vscode.window.showInformationMessage('Dashboard updated successfully');
      } else {
        vscode.window.showInformationMessage('No lint results available to update dashboard');
      }
    } catch (error) {
      console.error('Failed to read lint results or update dashboard:', error);
      vscode.window.showWarningMessage('No historical data found for this file in library');
    }
  }

  async function updateDashboard(lintResult: LintResult, chartType: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      console.error('No active editor to update dashboard');
      return;
    }

    const currentFile = editor.document.uri.fsPath;
    const resultsLibDir = path.join(extensionContext.extensionPath, 'Summary_Library');
    const fileName = createSafeFileName(editor.document);
    const resultsLibPath = path.join(resultsLibDir, fileName);

    let recentResults: HashedLintResult[] = [];
    try {
      const data = await fs.readFile(resultsLibPath, 'utf-8');
      recentResults = JSON.parse(data);
    } catch (error) {
      console.error('Error reading results file:', error);
      // If there's an error reading the file, we'll start with an empty array
      recentResults = [];
    }

    const currentHashedResult: HashedLintResult = {
      ...lintResult,
      hash: simpleLintResultHash(lintResult),
    };

    if (recentResults.length === 0 || recentResults[recentResults.length - 1].hash !== currentHashedResult.hash) {
      recentResults.push(currentHashedResult);
      // Keep only the last 10 results
      recentResults = recentResults.slice(-10);
    }

    // const chartData = {
    //   labels: recentResults.map((result) => result.summary.timeCreated),
    //   errorCounts: recentResults.map((result) => result.summary.errors),
    //   warnings: recentResults.map((result) => result.summary.warnings),
    // };

    // const dashboard = createDonutDashboard(extensionContext);
    // dashboard.webview.postMessage({
    //   command: 'loadData',
    //   fileName: path.basename(currentFile),
    //   data: chartData,
    // });
    if (chartType === 'donut') {
      const issuesCounts: any = {};
      lintResult.details.forEach((issue) => {
        if (issuesCounts[issue.ruleId]) {
          issuesCounts[issue.ruleId]++;
        } else {
          issuesCounts[issue.ruleId] = 1;
        }
      });

      const donutData = {
        labels: Object.keys(issuesCounts),
        errorCounts: Object.values(issuesCounts),
        // warnings: recentResults.map((result) => result.summary.warnings),
      };

      const donutDashboard = createDonutDashboard(extensionContext);
      donutDashboard.webview.postMessage({
        command: 'loadData',
        fileName: path.basename(currentFile),
        data: donutData,
      });
      console.log('Donut Dashboard updated with latest data');
    } else if (chartType === 'progression') {
      const chartData = {
        labels: recentResults.map((result) => result.summary.timeCreated),
        errorCounts: recentResults.map((result) => result.summary.errors),
        warnings: recentResults.map((result) => result.summary.warnings),
      };

      const dashboard = createChartDashboard(extensionContext);
      dashboard.webview.postMessage({
        command: 'loadData',
        fileName: path.basename(currentFile),
        data: chartData,
      });
    }
    console.log('ChartDashboard updated with latest data');
  }

  function clearDiagnostics() {
    diagnosticCollection.clear();
    showTemporaryInfoMessage('Diagnostics cleared for active workspace.');
    updateStatusBarItem();
  }

  async function lintActiveFile() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await lintDocument(editor.document, true);
    }
  }

  async function lintAllFiles() {
    const documents = vscode.workspace.textDocuments;
    for (const document of documents) {
      await lintDocument(document);
    }
  }

  function updateStatusBarItem() {
    console.log(`Updating status bar. Active: ${isActiveLintingEnabled}, All: ${isAllFilesLintingEnabled}`);

    if (isActiveLintingEnabled) {
      statusBarItem.text = '$(check-all) Ludwig: Active File';
    } else if (isAllFilesLintingEnabled) {
      statusBarItem.text = '$(check) Ludwig: All Files';
    } else {
      statusBarItem.text = '$(circle-slash) Ludwig: Disabled';
    }

    statusBarItem.command = 'ludwig.showLintingMenu';
    statusBarItem.tooltip = 'Click to change linting mode';
    statusBarItem.show();
  }

  async function showLintingMenu() {
    const selected = await vscode.window.showQuickPick(
      [
        {
          label: '$(file) Lint Active File',
          description: isActiveLintingEnabled ? '(current)' : '',
          detail: 'Enable linting for the currently active file only',
        },
        {
          label: '$(files) Lint All Files',
          description: isAllFilesLintingEnabled ? '(current)' : '',
          detail: 'Enable linting for all files in the workspace',
        },
        {
          label: '$(stop) Disable Linting',
          description: !isActiveLintingEnabled && !isAllFilesLintingEnabled ? '(current)' : '',
          detail: 'Turn off all linting',
        },
        {
          label: '$(graph) Generate Progression Chart',
          description: '📊 Visualize',
          detail: 'Update the dashboard with errors and warnings of current file over time',
        },
        {
          label: '$(graph) Generate Doughnut Chart',
          description: '📊 Visualize',
          detail: 'Update the dashboard with error distribution of current file',
        },
        {
          label: '$(trash) Reset Linting Library',
          description: '⚠️ Caution',
          detail: '*Deletes* all saved linting results  $(arrow-right) Use this to start fresh',
        },
      ],
      {
        placeHolder: 'Select linting mode',
        matchOnDescription: true,
        matchOnDetail: true,
      }
    );
    if (selected) {
      switch (selected.label) {
        case '$(file) Lint Active File':
          await toggleLintActiveFile(true);
          break;
        case '$(files) Lint All Files':
          await toggleLintAllFiles(true);
          break;
        case '$(stop) Disable Linting':
          await disableLinting();
          break;
        case '$(graph) Generate Progression Chart':
          await updateDashboardCommand('progression');
          break;
        case '$(graph) Generate Doughnut Chart':
          await updateDashboardCommand('donut');
          break;
        case '$(trash) Reset Linting Library':
          await resetLib();
          break;
      }
    }
  }
  async function toggleLintActiveFile(enable: boolean) {
    isActiveLintingEnabled = enable;
    isAllFilesLintingEnabled = false;
    updateStatusBarItem();

    if (isActiveLintingEnabled) {
      showTemporaryInfoMessage('Linting enabled for active file');
      await lintActiveFile();
    } else {
      showTemporaryInfoMessage('Linting disabled for active file');
    }
  }

  async function toggleLintAllFiles(enable: boolean) {
    isAllFilesLintingEnabled = enable;
    isActiveLintingEnabled = false;
    updateStatusBarItem();

    if (isAllFilesLintingEnabled) {
      showTemporaryInfoMessage('Linting enabled for all files');
      await lintAllFiles();
    } else {
      showTemporaryInfoMessage('Linting disabled for all files');
    }
  }

  async function disableLinting() {
    isActiveLintingEnabled = false;
    isAllFilesLintingEnabled = false;
    updateStatusBarItem();
    diagnosticCollection.clear();
    showTemporaryInfoMessage('Linting disabled');
  }

  function showTemporaryInfoMessage(
    message: string,
    timeout: number = 3000,
    messageType: 'info' | 'statusBar' = 'statusBar'
  ) {
    if (messageType === 'info') {
      vscode.window.showInformationMessage(message);
    } else {
      const statusBarMessage = vscode.window.setStatusBarMessage(message, timeout);
      setTimeout(() => statusBarMessage.dispose(), timeout);
    }
  }

  async function resetLib() {
    const libraryPath = path.join(extensionContext.extensionPath, 'Summary_Library');
    const answer = await vscode.window.showWarningMessage(
      'Are you sure you want to reset the Ludwig Summary Library? This action cannot be undone.',
      'Yes',
      'No'
    );

    if (answer !== 'Yes') {
      return;
    }
    try {
      await fs.rm(libraryPath, { recursive: true, force: true });
      vscode.window.showInformationMessage('Ludwig Report Library has been reset successfully.');
      console.log('Summary_Library folder deleted successfully');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        vscode.window.showInformationMessage('Ludwig Report Library was already empty.');
        console.log('Summary_Library folder does not exist');
      } else {
        vscode.window.showErrorMessage('Failed to reset Ludwig Report Library. Please try again.');
        console.error('Error deleting Summary_Library folder:', error);
      }
    }
  }
}
