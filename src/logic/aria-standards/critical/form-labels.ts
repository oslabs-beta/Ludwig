const { getLineNumber } = require('../../getLineNumber');

export function formsHaveLabelsCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node) => {
    const labels = Array.from(node.querySelectorAll('label'));
    const labelFors = labels.map((label: any) => label.getAttribute('for'));

    const inputs = Array.from(node.querySelectorAll('input'));
    inputs.forEach((input: any) => {
      const inputId = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      if (!ariaLabel && !ariaLabelledBy && !labelFors.includes(inputId)) {
        const lineNumber = getLineNumber(input);
        recs.push([lineNumber, input.outerHTML]);
      }
    });
  });

  return recs;
}
