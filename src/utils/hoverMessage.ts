// /* eslint-disable @typescript-eslint/no-var-requires */

// import * as vscode from 'vscode';
// import { compileLogic } from '../logic/logicCompiler';
// import { ariaObject } from '../logic/aria-standards/aria-object';

// // create empty object to store recommendations by line number for hover functionality
// // {line number as string : array of aria-object keys}
// const recsByLineNumber: { [key: string]: string[] } = {};

// const activeEditor = vscode.window.activeTextEditor;

// if (activeEditor) {
//   // invoke compileLogic to get object with ARIA recommendations
//   const ariaRecommendations = await compileLogic(activeEditor)[0];
//   console.log('ariaRecommendations: ', ariaRecommendations);

//   // populate recsByLineNumber
//   for (const [ariaObjKey, recsArrays] of Object.entries(ariaRecommendations)) {
//     // skip totalElements and criticalIssuesByType keys
//     if (ariaObjKey === 'totalElements' || ariaObjKey === 'criticalIssuesByType') {
//       continue;
//     }

//     for (const [lineNumber, _outerHTML] of recsArrays as [number, string][]) {
//       if (!recsByLineNumber[lineNumber]) {
//         recsByLineNumber[lineNumber] = [ariaObjKey];
//       } else if (!recsByLineNumber[lineNumber].includes(ariaObjKey)) {
//         // don't add duplicate ariaObjKeys to the same line
//         recsByLineNumber[lineNumber].push(ariaObjKey);
//       }
//     }
//   }
// }

// // Hover provider to show a popup window with ARIA recommendations

// export function provideHover(document: any, position: any) {
//   // check if there are recommendations for the line
//   if (recsByLineNumber[position.line + 1]) {
//     const ariaObjKeys = recsByLineNumber[position.line + 1];

//     // create range for line
//     const range = document.lineAt(position.line).range;

//     let messageText = '';

//     if (ariaObjKeys.length > 1) {
//       messageText += '**Ludwig Recommendations:**';
//     } else {
//       messageText += '**Ludwig Recommendation:**';
//     }

//     // loop through each recommendation for the line to create text for hover message
//     for (let i = 0; i < ariaObjKeys.length; i++) {
//       if (i > 0) {
//         messageText += '\n\n---';
//       }

//       const description: any = (ariaObject as any)[ariaObjKeys[i]].desc;
//       messageText += `\n\n- ${description}`;

//       const link: any = (ariaObject as any)[ariaObjKeys[i]].link;
//       messageText += `\n\n  [Read More](${link})`;
//     }

//     const hoverMessage = new vscode.MarkdownString(messageText);

//     return new vscode.Hover(hoverMessage, range);
//   }

//   return null;
// }
