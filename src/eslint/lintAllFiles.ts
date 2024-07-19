// // lintAllFiles.ts

// import { workspace, window, ProgressLocation, Uri, ExtensionContext, DiagnosticCollection } from 'vscode';
// import { runESLint } from './runESLint';
// import { createDiagnosticsFromResults } from './eslintDiagnostics';
// import { showTemporaryInfoMessage } from '../utils/messaging';

// export async function lintAllFiles(
//   extensionContext: ExtensionContext,
//   diagnosticCollection: DiagnosticCollection
// ): Promise<void> {
//   const files = await workspace.findFiles('**/*.{js,jsx,ts,tsx}', '**/node_modules/**');

//   let totalErrors = 0;
//   let totalWarnings = 0;

//   await window.withProgress(
//     {
//       location: ProgressLocation.Notification,
//       title: 'Linting all files',
//       cancellable: true,
//     },
//     async (progress, token) => {
//       const totalFiles = files.length;
//       let processedFiles = 0;

//       const promises = files.map(async (file: Uri) => {
//         if (token.isCancellationRequested) {
//           return;
//         }

//         const document = await workspace.openTextDocument(file);
//         const results = await runESLint(document, extensionContext);

//         if (results !== null) {
//           const diagnostics = createDiagnosticsFromResults(document, results);
//           diagnosticCollection.set(document.uri, diagnostics);

//           totalErrors += diagnostics.filter((d) => d.severity === 0).length;
//           totalWarnings += diagnostics.filter((d) => d.severity === 1).length;
//         }

//         processedFiles++;
//         progress.report({ increment: 100 / totalFiles, message: `${processedFiles}/${totalFiles} files processed` });
//       });

//       await Promise.all(promises);

//       if (token.isCancellationRequested) {
//         showTemporaryInfoMessage('Linting cancelled');
//       } else {
//         showTemporaryInfoMessage(`Linting completed. Errors: ${totalErrors}, Warnings: ${totalWarnings}`);
//       }
//     }
//   );
// }
