const { getLineNumber } = require('../../getLineNumber');

// check that all ids in doc are unique
function checkUniqueIds(nodes) {

    const idSet = new Set();
    const recs = [];
    
    nodes.forEach(node => {

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

module.exports = {
  checkUniqueIds
};