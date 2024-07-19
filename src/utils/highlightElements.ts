import * as vscode from 'vscode';
import { compileLogic } from '../logic/logicCompiler';
import { ariaObject } from '../logic/aria-standards/aria-object';

// Create decoration type outside of the function
const decorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  overviewRulerColor: 'red',
  backgroundColor: 'rgba(255, 0, 0, 0.2)',
});

// create empty object to store recommendations by line number for hover functionality
// {line number as string : array of aria-object keys}
const recsByLineNumber: { [key: string]: string[] } = {};

export async function highlightElements(document: vscode.TextDocument) {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor) {
    // invoke compileLogic to get object with ARIA recommendations
    const ariaRecommendations = await compileLogic(activeEditor);
    console.log('ariaRecommendations: ', ariaRecommendations);

    // populate recsByLineNumber
    for (const [ariaObjKey, recsArrays] of Object.entries(ariaRecommendations)) {
      // skip totalElements and criticalIssuesByType keys
      if (ariaObjKey === 'totalElements' || ariaObjKey === 'criticalIssuesByType') {
        continue;
      }

      for (const [lineNumber, _outerHTML] of recsArrays as [number, string][]) {
        if (!recsByLineNumber[lineNumber]) {
          recsByLineNumber[lineNumber] = [ariaObjKey];
        } else if (!recsByLineNumber[lineNumber].includes(ariaObjKey)) {
          // don't add duplicate ariaObjKeys to the same line
          recsByLineNumber[lineNumber].push(ariaObjKey);
        }
      }
    }
    console.log('recsByLineNumber: ', recsByLineNumber);
    console.log('criticalIssuesByType: ', ariaRecommendations.criticalIssuesByType);

    // create array of ranges to highlight
    const highlightedRanges: vscode.Range[] = [];
    for (const lineNumber of Object.keys(recsByLineNumber)) {
      const line = document.lineAt(Number(lineNumber) - 1);
      const lineRange = line.range;
      // const lineRange = new vscode.Range(line.range.start, line.range.end);
      highlightedRanges.push(lineRange);
    }

    // Clear existing decorations before applying new ones - prevents red from getting brighter and brighter
    activeEditor.setDecorations(decorationType, []);

    // Apply red background thing to highlight the lines
    activeEditor.setDecorations(decorationType, highlightedRanges);
  }
}

export function clearHighlights() {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    activeEditor.setDecorations(decorationType, []);
  }
}

// Hover provider to show a popup window with ARIA recommendations

export function provideHover(document: any, position: any) {
  // check if there are recommendations for the line
  if (recsByLineNumber[position.line + 1]) {
    const ariaObjKeys = recsByLineNumber[position.line + 1];

    // create range for line
    const range = document.lineAt(position.line).range;

    let messageText = '';

    if (ariaObjKeys.length > 1) {
      messageText += '**Ludwig Recommendations:**';
    } else {
      messageText += '**Ludwig Recommendation:**';
    }

    // loop through each recommendation for the line to create text for hover message
    for (let i = 0; i < ariaObjKeys.length; i++) {
      if (i > 0) {
        messageText += '\n\n---';
      }

      const description: any = (ariaObject as any)[ariaObjKeys[i]].desc;
      messageText += `\n\n- ${description}`;

      const link: any = (ariaObject as any)[ariaObjKeys[i]].link;
      messageText += `\n\n  [Read More](${link})`;
    }

    const hoverMessage = new vscode.MarkdownString(messageText);

    return new vscode.Hover(hoverMessage, range);
  }

  return null;
}
