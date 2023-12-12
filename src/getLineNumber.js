export function getLineNumber(document, node, set) {
    const htmlCode = document.getText();
    const lines = htmlCode.split('\n');
  
    for (let i = 0; i < lines.length; i++) {
      if(!set.has(i + 1)){
        const line = lines[i];
        const indexInLine = line.indexOf(node.outerHTML);
        if (set.has(indexInLine)) {
          line.indexOf(node.outerHTML, indexInLine+1);
        }
    
        if (indexInLine !== -1) {
          return i + 1;
        }
      }
    }
  }