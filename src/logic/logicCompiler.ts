import * as Critical from './aria-standards/critical';
import * as vscode from 'vscode';
const { JSDOM } = require('jsdom');
let body: any, document: any;

export interface AriaRecommendations {
  [key: string]: any;
  totalElements: number;
}

export function cloneDomFromSource(source: any) {
  const htmlCode = addLineNumbersToHtml(source.document.getText());
  const { window } = new JSDOM(htmlCode, {
    url: 'http://ciafund.gov',
    pretendToBeVisual: true,
    includeNodeLocations: true,
  });
  document = window.document;
  body = window.document.body;
}

export async function compileLogic(activeEditor: vscode.TextEditor) {
  const ariaRecommendations: AriaRecommendations = {
    totalElements: 0,
  };
  cloneDomFromSource(activeEditor);
  function tag(element: any) {
    return body.querySelectorAll(element);
  }

  ariaRecommendations.anchorLabel = Critical.anchorLabelCheck(tag('a'));

  ariaRecommendations.areaAltText = Critical.areaAltTextCheck(tag('area'));

  ariaRecommendations.ariaHidden = Critical.ariaHiddenCheck(tag('*'));

  ariaRecommendations.discernibleButtonText = Critical.discernibleButtonTextCheck(tag('button'));

  ariaRecommendations.uniqueIDs = Critical.uniqueIDsCheck(tag('[id]'));

  ariaRecommendations.imageAlts = Critical.imageAltsCheck(tag('img'));

  ariaRecommendations.inputButton = Critical.inputButtonCheck(tag('input'));

  ariaRecommendations.metaEquivRefresh = Critical.metaEquivRefreshCheck(tag('meta'));

  ariaRecommendations.metaViewport = Critical.metaViewportCheck(tag('meta[name="viewport"]'));

  ariaRecommendations.selectHasAccessName = Critical.selectHasAccessNameCheck(tag('select'));

  ariaRecommendations.videoCaptions = Critical.videoCaptionsCheck(tag('video'));

  ariaRecommendations.formsHaveLabels = Critical.formsHaveLabelsCheck(tag('form'));

  // I'M HOLDING OFF ON THIS ONE FOR NOW - Spencer 7/4/24
  // // role-support-aria-attribute
  // const roleSupportHtml = checkAriaRoles();

  // roleSupportHtml.forEach((element: string[], index: number) => {
  //     ariaRecommendations[element[2]] = [{link: element[1], desc: 'Please select "Read More" below to see documentation for this error.'}, element[0]];
  // });

  for (const key in ariaRecommendations) {
    if (Array.isArray(ariaRecommendations[key]) && ariaRecommendations[key].length === 0) {
      delete ariaRecommendations[key];
    }
  }

  // create property criticalIssuesByType
  ariaRecommendations.criticalIssuesByType = {};
  for (const key in ariaRecommendations) {
    if (key !== 'totalElements' && key !== 'criticalIssuesByType') {
      ariaRecommendations.criticalIssuesByType[key] = ariaRecommendations[key].length;
    }
  }
  

  ariaRecommendations.totalElements = body.querySelectorAll('*').length;
  // the reason for saving the total number of elements in the document now is because this is the only place in the code where we create the JSDOM
  // totalElements will be used in the react dashboard to calculate the percentage of elements that are accessible


  return ariaRecommendations;
}

function addLineNumbersToHtml(htmlCode: string) {
  const lines = htmlCode.split('\n');
  for (let i = 0; i < lines.length; i++) {
    lines[i] += `<!-- html line number: ${i + 1} -->`;
  }
  return lines.join('\n');
}
