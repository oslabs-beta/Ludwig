/* eslint-disable @typescript-eslint/no-var-requires */

const { ariaObject } = require('../aria-standards/critical/aria-object');
function inputButtonText(input: any, ariaRecommendations: any) {
  const inputButtonsWithoutText: any[] = [];
  input.forEach((el: any) => {
    const line = Math.floor(Math.random() * 5000) + 1;
    inputButtonsWithoutText.push([el.outerHTML, line]);
    ariaRecommendations[line] = [ariaObject.inputButton, el.outerHTML];
  });
  return inputButtonsWithoutText;
}

function evalAnchors(input: any, ariaRecommendations: any) {
  const anchorsWithoutAriaLabel: any[] = [];
  input.forEach((el: any) => {
    const ariaLabel = el.getAttribute('aria-label');
    if (!ariaLabel) {
      const line = Math.floor(Math.random() * 5000) + 1;
      anchorsWithoutAriaLabel.push([el.outerHTML, line]);
      ariaRecommendations[line] = [ariaObject.anchorLabel, el.outerHTML];
    }
  });
  return anchorsWithoutAriaLabel;
}

function areaMapAltText(input: any, ariaRecommendations: any) {
  const areaMapsWithoutAltText: any[] = [];
  input.forEach((el: any) => {
    const altText = el.getAttribute('alt');
    const newElement = el.outerHTML.replace('>', ' />');
    const line = Math.floor(Math.random() * 5000) + 1;
    if (!altText || altText === '') {
      areaMapsWithoutAltText.push([newElement, line]);
      ariaRecommendations[line] = [ariaObject.areaAltText, newElement];
    }
  });
  return areaMapsWithoutAltText;
}

function buttonText(input: any, ariaRecommendations: any) {
  const buttonText: any[] = [];
  input.forEach((el: any) => {
    if (el.innerHTML === '') {
      const line = Math.floor(Math.random() * 5000) + 1;
      buttonText.push([el.outerHTML, line]);
      ariaRecommendations[line] = [ariaObject.discernibleButtonText, el.outerHTML];
    }
  });
  return buttonText;
}

module.exports = {
  inputButtonText,
  evalAnchors,
  areaMapAltText,
  buttonText,
  //   ariaHidden,
  //   uniqueIds,
  //   imgAltText,
  //   metaHttpRefresh,
  //   metaViewportTextResize,
  //   selectName,
  //   videoCaptions,
  //   Labels,
  //   ariaRoles,
};
