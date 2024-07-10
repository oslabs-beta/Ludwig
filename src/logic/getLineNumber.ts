export function getLineNumber(node: any) {
  // input: JSDOM node
  // output: line number of node in html file

  let next = node.nextSibling;

  while (next) {
    if (next.nodeType === 8) {
      // nodeType 8 is a comment

      // regex to get line number from HTML comment
      const regex = /html line number: (\d+)/;

      const match = regex.exec(next.nodeValue);

      if (match) {
        return Number(match[1]);
      }
    }

    next = next.nextSibling; // Move to the next sibling
  }
}
