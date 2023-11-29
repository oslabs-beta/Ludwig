import * as vscode from 'vscode';
const { evalAnchors } = require('./aria-standards/critical/anchor-labels.js');
const { checkAreaMapAltText } = require('./aria-standards/critical/area-maps-alt-text.js');
const { checkAriaHidden } = require('./aria-standards/critical/aria-hidden.js');
const { checkButtonText } = require('./aria-standards/critical/button-text.js');
const { checkUniqueIds } = require('./aria-standards/critical/unique-ids.js');
const { checkImgAltText } = require('./aria-standards/critical/img-alt-text.js');
const { checkMetaViewportTextResize } = require('./aria-standards/critical/meta-viewport-text-zoom.js');


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

    areaMapsWithoutAltText.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
      });

    // aria-hidden
    const hiddenAria = await checkAriaHidden();

    hiddenAria.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
      });

    // button-text
    const buttonText = await checkButtonText();

    buttonText.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    // unique-ids
    const duplicateElements = await checkUniqueIds();

    duplicateElements.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
      });

    // img alt text
    const imgAlts = await checkImgAltText();
    
    imgAlts.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    // meta-viewport-text-zoom
    const metaViewportElements = await checkMetaViewportTextResize();

    metaViewportElements.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
      });


    return ariaRecommendations;
}
