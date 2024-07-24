const { getLineNumber } = require('../../getLineNumber');

// check that all ids in doc are unique
export function uniqueIDsCheck(nodes: any[]) {
  const recs: any[][] = [];
  const idSet = new Set();

  nodes.forEach((node) => {
    const id = node.id;

    if (idSet.has(id)) {
      const lineNumber = getLineNumber(node);
      if (lineNumber) recs.push([lineNumber, node.outerHTML]);
    } else {
      idSet.add(id);
    }
  });

  return recs;
}
