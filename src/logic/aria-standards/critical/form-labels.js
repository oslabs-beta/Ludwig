const { getLineNumber } = require('../../getLineNumber');

function checkLabels(nodes) {

  const recs = [];

  nodes.forEach((node) => {

    const labels = node.querySelectorAll('label');
    const labelFors = labels.map(label => label.getAttribute('for'));

    const inputs = node.querySelectorAll('input');
    inputs.forEach((input) => {

      const inputId = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      if (!ariaLabel &&
        !ariaLabelledBy &&
        !labelFors.includes(inputId)) {

          const lineNumber = getLineNumber(input);
          recs.push([lineNumber, input.outerHTML]);
      }
    });
  });

  return recs;
}

module.exports = {
  checkLabels
};