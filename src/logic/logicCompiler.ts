import * as vscode from 'vscode';
const { JSDOM } = require('jsdom');

const { anchorLabelCheck } = require('./aria-standards/critical/anchor-labels.js');
const { areaAltTextCheck } = require('./aria-standards/critical/area-maps-alt-text.js');
const { ariaHiddenCheck } = require('./aria-standards/critical/aria-hidden.js');
const { discernibleButtonTextCheck } = require('./aria-standards/critical/button-text.js');
const { imageAltsCheck } = require('./aria-standards/critical/img-alt-text.js');
const { inputButtonCheck } = require('./aria-standards/critical/input-button.js');
const { metaEquivRefreshCheck } = require('./aria-standards/critical/meta-http-equiv-refresh.js');
const { metaViewportCheck } = require('./aria-standards/critical/meta-viewport-text-zoom.js');
const { selectHasAccessNameCheck } = require('./aria-standards/critical/select-name.js');
const { uniqueIDsCheck } = require('./aria-standards/critical/unique-ids.js');
const { videoCaptionsCheck } = require('./aria-standards/critical/video-captions.js');
const { formsHaveLabelsCheck } = require('./aria-standards/critical/form-labels.js');
const { checkAriaRoles } = require('./aria-standards/critical/role-support-aria-attribute.js'); // this is the only one I left completely unchanged... it's hairy


export interface AriaRecommendations {
    [key: string]: any;
}

export function compileLogic() {
    const ariaRecommendations: AriaRecommendations = {};

    const htmlCode = vscode.window.activeTextEditor.document.getText();
  
    // split htmlCode on new lines
    const lines = htmlCode.split('\n');
  
    // loop through each line adding line number as an html comment to the end of the line
    for (let i = 0; i < lines.length; i++) {
        lines[i] += `<!-- html line number: ${i + 1} -->`;
    }

    // join the lines back together
    const htmlCodeWithLineNumbers = lines.join('\n');
  
    // pass the joined string to JSDOM
    const dom = new JSDOM(htmlCodeWithLineNumbers, {
      url: 'http://ciafund.gov',
      pretendToBeVisual: true,
      includeNodeLocations: true,
    });
    const body = dom.window.document.body;
  
    function tag(element: any) {
      return body.querySelectorAll(element);
    }

    // anchor-label
    ariaRecommendations.anchorLabel = anchorLabelCheck(tag('a'));
// I changed functionality for this one and the next, but not the rest

    // area-maps-alt-text
    ariaRecommendations.areaAltText = areaAltTextCheck(tag('area'));

    // aria-hidden
    ariaRecommendations.ariaHidden = ariaHiddenCheck(tag('*'));

    // button-text
    ariaRecommendations.discernibleButtonText = discernibleButtonTextCheck(tag('button'));

    // unique-ids
    ariaRecommendations.uniqueIDs = uniqueIDsCheck(tag('[id]'));

    // img alt text
    ariaRecommendations.imageAlts = imageAltsCheck(tag('img'));

    // input-button
    ariaRecommendations.inputButton = inputButtonCheck(tag('input'));

    // meta-http-equiv-refresh
    ariaRecommendations.metaEquivRefresh = metaEquivRefreshCheck(tag('meta'));

    // meta-viewport-text-zoom
    ariaRecommendations.metaViewport = metaViewportCheck(tag('meta[name="viewport"]'));

    // select-name
    ariaRecommendations.selectHasAccessName = selectHasAccessNameCheck(tag('select'));

    // video-captions
    ariaRecommendations.videoCaptions = videoCaptionsCheck(tag('video'));

    // ARIAlogic - forms have labels
    ariaRecommendations.formsHaveLabels = formsHaveLabelsCheck(tag('form'));


// I'M HOLDING OFF ON THIS ONE FOR NOW - Spencer 7/4/24
    // // role-support-aria-attribute
    // const roleSupportHtml = checkAriaRoles();

    // roleSupportHtml.forEach((element: string[], index: number) => {
    //     ariaRecommendations[element[2]] = [{link: element[1], desc: 'Please select "Read More" below to see documentation for this error.'}, element[0]];
    // });

    
    // delete any properties that hold empty arrays
    for (const key in ariaRecommendations) {
        if (Array.isArray(ariaRecommendations[key]) && ariaRecommendations[key].length === 0) {
            delete ariaRecommendations[key];
        }
    }

    // create totalElements property with total number of elements in the document
    const totalElements: number = body.querySelectorAll('*').length;
    ariaRecommendations.totalElements = totalElements;
    // the reason for saving the total number of elements in the document now is because this is the only place in the code where we create the JSDOM
    // totalElements will be used in the react dashboard to calculate the percentage of elements that are accessible

    // RETURN FINAL OBJECT
    return ariaRecommendations;
}