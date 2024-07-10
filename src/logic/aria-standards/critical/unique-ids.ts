const { getLineNumber } = require('../../getLineNumber');

// check that all ids in doc are unique
export function uniqueIDsCheck(nodes: any[]) {
  const recs: any[][] = [];
  const idSet = new Set();

  nodes.forEach((node) => {
    const id = node.id;

    if (idSet.has(id)) {
      const lineNumber = getLineNumber(node);
      recs.push([node.outerHTML, lineNumber]);
    } else {
      idSet.add(id);
    }
  });

  return recs;
}
