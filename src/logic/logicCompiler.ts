const mariacheck = require('./maria-standard/allTheMarias');
const { JSDOM } = require('jsdom');
let body: any, document: any;

export function generateBody(source: any) {
  const htmlCode = source.document.getText();
  const { window } = new JSDOM(htmlCode, {
    url: 'http://ciafund.gov',
    pretendToBeVisual: true,
    includeNodeLocations: true,
  });
  document = window.document;
  body = window.document.body;
}

export function getDocument() {
  return document;
}

export async function compileLogic(activeEditor: any) {
  const ariaRecommendations: AriaRecommendations = {};
  generateBody(activeEditor);

  function tag(element: any) {
    return document.querySelectorAll(element);
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
  // console.log(ariaRecommendations);
  return ariaRecommendations;
}

export interface AriaRecommendations {
  [key: string]: any;
}
