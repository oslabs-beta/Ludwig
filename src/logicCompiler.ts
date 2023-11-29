import * as vscode from 'vscode';
const { evalAnchors } = require('./aria-standards/critical/anchor-labels.js');
const { checkAreaMapAltText } = require('./aria-standards/critical/area-maps-alt-text.js');
const { checkAriaHidden } = require('./aria-standards/critical/aria-hidden.js');
const { checkButtonText } = require('./aria-standards/critical/button-text.js');
const { checkImgAltText } = require('./aria-standards/critical/img-alt-text.js');
const { inputButtonText } = require('./aria-standards/critical/input-button.js');
const { checkMetaHttpRefresh } = require('./aria-standards/critical/meta-http-equiv-refresh.js');
const { checkMetaViewportTextResize } = require('./aria-standards/critical/meta-viewport-text-zoom.js');
const { selectName } = require('./aria-standards/critical/select-name.js');
const { checkUniqueIds } = require('./aria-standards/critical/unique-ids.js');
const { videoCaptions } = require('./aria-standards/critical/video-captions.js');

const { ariaObject } = require('./aria-standards/critical/aria-object.js');


export interface AriaRecommendations {
    [key: string]: object;
}

export async function compileLogic(document: vscode.TextDocument): Promise<AriaRecommendations> {
    const ariaRecommendations: AriaRecommendations = {};

    // anchor-label
    const anchorsWithoutAriaLabel = await evalAnchors();

    anchorsWithoutAriaLabel.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.anchorLabel;
    });

    // area-maps-alt-text
    const areaMapsWithoutAltText = await checkAreaMapAltText();

    areaMapsWithoutAltText.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.areaAltText;
      });

    // aria-hidden
    const hiddenAria = await checkAriaHidden();

    hiddenAria.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.ariaHidden;
      });

    // button-text
    const buttonText = await checkButtonText();

    buttonText.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.discernibleButtonText;
    });

    // unique-ids
    const duplicateElements = await checkUniqueIds();

    duplicateElements.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.uniqueIDs;
      });

    // img alt text
    const imgAlts = await checkImgAltText();
    
    imgAlts.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.imageAlts;
    });

    // input-button
    const inputButtonsWithoutText = await inputButtonText();

    inputButtonsWithoutText.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    // meta-http-equiv-refresh
    const metaWrongContent = await checkMetaHttpRefresh();

    metaWrongContent.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    // meta-viewport-text-zoom
    const metaViewportElements = await checkMetaViewportTextResize();

    metaViewportElements.forEach((element: string, index: number) => {
        ariaRecommendations[element] = ariaObject.metaViewport;
      });

    // select-name
    const selectArray = await selectName();

    selectArray.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });


    // video-captions
    const videosArray = await videoCaptions();

    videosArray.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    // RETURN FINAL OBJECT
    return ariaRecommendations;
}
