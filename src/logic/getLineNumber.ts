export function getLineNumber(node: any) {
  while (node) {
    if (node.nodeType === 8) {
      // nodeType 8 is a comment

      // regex to get line number from HTML comment
      const regex = /html line number: (\d+)/;

      const match = regex.exec(node.nodeValue);

      if (match) {
        return Number(match[1]);
      }
    }

    // Move to the next sibling
    if (node.nextSibling) {
      node = node.nextSibling;
    } else {
      node = node.nextElementSibling;
    }
  }
}
