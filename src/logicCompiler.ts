import * as vscode from 'vscode';
const { evalAnchors } = require('./aria-standards/critical/anchor-labels.js'); // import anchor-labels file
const { checkAreaMapAltText } = require('./aria-standards/critical/area-maps-alt-text.js')

export interface AriaRecommendations {
    [key: string]: string;
}

export async function compileLogic(document: vscode.TextDocument): Promise<AriaRecommendations> {
    const ariaRecommendations: AriaRecommendations = {};

    // anchor-label
    const anchorsWithoutAriaLabel = await evalAnchors();

    anchorsWithoutAriaLabel.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    // area-maps-alt-text
    const areaMapsWithoutAltText = await checkAreaMapAltText();
    console.log('areaMapsWithoutAltText: ', areaMapsWithoutAltText);

    areaMapsWithoutAltText.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
      });

    return ariaRecommendations;
}
