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
const { checkLabels } = require('./aria-standards/critical/form-labels.js');
const { checkAriaRoles } = require('./aria-standards/critical/role-support-aria-attribute.js');

const { ariaObject } = require('./aria-standards/critical/aria-object.js');


export interface AriaRecommendations {
    [key: string]: any;
}

export async function compileLogic(document: vscode.TextDocument): Promise<AriaRecommendations> {
    const ariaRecommendations: AriaRecommendations = {};

    // anchor-label
    const anchorsWithoutAriaLabel = await evalAnchors();

    anchorsWithoutAriaLabel.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.anchorLabel, element[0]];
    });

    // area-maps-alt-text
    const areaMapsWithoutAltText = await checkAreaMapAltText();

    areaMapsWithoutAltText.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.areaAltText, element[0]];
      });

    // aria-hidden
    const hiddenAria = await checkAriaHidden();

    hiddenAria.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.ariaHidden, element[0]];
      });

    // button-text
    const buttonText = await checkButtonText();

    buttonText.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.discernibleButtonText, element[0]];
    });

    // unique-ids
    const duplicateElements = await checkUniqueIds();

    duplicateElements.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.uniqueIDs, element[0]];
      });

    // img alt text
    const imgAlts = await checkImgAltText();
    
    imgAlts.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.imageAlts, element[0]];
    });

    // input-button
    const inputButtonsWithoutText = await inputButtonText();

    inputButtonsWithoutText.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.inputButton, element[0]];
    });

    // meta-http-equiv-refresh
    const metaWrongContent = await checkMetaHttpRefresh();

    metaWrongContent.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.metaEquivRefresh, element[0]];
    });

    // meta-viewport-text-zoom
    const metaViewportElements = await checkMetaViewportTextResize();

    metaViewportElements.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.metaViewport, element[0]];
      });

    // select-name
    const selectArray = await selectName();

    selectArray.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.selectHasAccessName, element[0]];
    });

    // video-captions
    const videosArray = await videoCaptions();

    videosArray.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.videoCaptions, element[0]];
    });

    // ARIAlogic - forms have labels
    const formArray = await checkLabels();

    formArray.forEach((element: string, index: number) => {
        ariaRecommendations[element[1]] = [ariaObject.formsHaveLabels, element[0]];
    });

    // role-support-aria-attribute
    const roleSupportHtml = await checkAriaRoles();

    roleSupportHtml.forEach((element: string[], index: number) => {
        ariaRecommendations[element[2]] = [{link: element[1], desc: 'Please select "Read More" below to see documentation for this error.'}, element[0]];
    });

    // RETURN FINAL OBJECT
    return ariaRecommendations;
}
