import * as vscode from 'vscode';
const mariacheck = require('./maria-standard/allTheMarias');
const { JSDOM } = require('jsdom');

export function compileLogic() {
  const ariaRecommendations: AriaRecommendations = {};
  const htmlCode = vscode.window.activeTextEditor.document.getText();
  const dom = new JSDOM(htmlCode, {
    url: 'http://ciafund.gov',
    pretendToBeVisual: true,
    includeNodeLocations: true,
  });
  const body = dom.window.document.body;

  function tag(element: any) {
    return body.querySelectorAll(element);
  }

  mariacheck.inputButtonText(tag('input'), ariaRecommendations);
  mariacheck.evalAnchors(tag('a'), ariaRecommendations);
  // mariacheck.AreaMapAltText(tag('alt'));
  // mariacheck.AriaHidden(tag('*'), ariaRecommendations);
  // mariacheck.buttonText(tag('button'));
  // mariacheck.uniqueIds(tag('***'), ariaRecommendations);
  // mariacheck.imgAltText(tag('***'), ariaRecommendations);
  // mariacheck.metaHttpRefresh(tag('***'), ariaRecommendations);
  // mariacheck.metaViewportTextResize(tag('***'), ariaRecommendations);
  // mariacheck.selectName(tag('***'), ariaRecommendations);
  // mariacheck.videoCaptions(tag('***'), ariaRecommendations);
  // mariacheck.labels(tag('input, ***, textarea'), ariaRecommendations);
  // mariacheck.ariaRoles(tag('***'), ariaRecommendations);
  return ariaRecommendations;
}

export interface AriaRecommendations {
  [key: string]: any;
}
