export function getLineNumber(document, node, set) {
    const htmlCode = document.getText();
    const lines = htmlCode.split('\n');
  
    for (let i = 0; i < lines.length; i++) {
      if(!set.has(i + 1)){
        const line = lines[i];
        const indexInLine = line.indexOf(node);
        if (set.has(indexInLine)) {
          line.indexOf(node, indexInLine);
        }
    
        if (indexInLine !== -1) {
          return i + 1;
        }
      }
    }
  }





  // function getLineNumber(document: any, htmlElement: any) {
  //   const text = document.getText();
  //   const index = text.indexOf(htmlElement);
  //   // if (index === -1) {
  //   //   return null;
  //   // }
  //   return document.positionAt(index).line;
  // }