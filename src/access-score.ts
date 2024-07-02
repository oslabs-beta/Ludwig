import { AriaRecommendations } from './logicCompiler';
import * as vscode from 'vscode';
import { JSDOM } from 'jsdom';

export default function getAccessScore(
  recs: AriaRecommendations
): { x: string; y: number }[] {
  // Get the active text editor from VS Code
  const activeEditor = vscode.window.activeTextEditor;

  // Check if there is an active editor and it has a document
  if (activeEditor && activeEditor.document) {
    // Get the HTML code from the active document
    const htmlCode = activeEditor.document.getText();

    // Create a virtual DOM using JSDOM
    const { window } = new JSDOM(htmlCode);
    const document = window.document;

    // Calculate the total number of elements in the HTML document
    const totalElements: number = Array.from(
      document.querySelectorAll('*')
    ).length;

    // Calculate the total number of Aria recommendations
    const totalRecs: number = Object.keys(recs).length;

    // Calculate the Accessible and Inaccessible counts
    const accessibleCount: number = totalElements - totalRecs;
    const inaccessibleCount: number = totalRecs;

    return [
      { x: 'Accessible', y: accessibleCount },
      { x: 'Inaccessible', y: inaccessibleCount },
    ];
  } else {
    // Handle the case when there is no active editor or document
    throw new Error('No active editor or document found.');
  }
}
