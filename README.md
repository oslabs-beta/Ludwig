![Ludwig-VS Logo](./assets/Ludwig-VSMarket.jpg)

# Ludwig README

Ludwig VS is a VS Code extension that makes writing accessible HTML easier for developers. Ludwig offers in-line highlighting of HTML that is not in compliance with WCAG and WAI-ARIA standards and provides recommendations to enhance the accessibility of your HTML code. 

One sixth of the world’s population will experience a disability at some point in their lifetime, but 98% of websites contain inaccessibility issues, making them challenging for individuals with disabilities to use. Ludwig tackles this problem directly by providing a reliable tool that developers can leverage during the development process, rather than relying solely on post-development accessibility testing. Ludwig highlights HTML accessibility errors in real-time, such as missing ARIA-attributes or empty tags. When a developer hovers over the highlighted code, a hover message will display the root issue and provide further documentation for reference. Additionally, the Ludwig dashboard panel offers a comprehensive overview of the errors in a developer’s HTML and provides a custom accessibility score for the developer to gauge and improve their web content’s accessibility. 

Ludwig tests HTML for over 85 of the most critical and common accessibility guidelines outlined by WAI-ARIA. We still plan on expanding Ludwig’s capabilities to provide coverage for all guidelines as well as by providing testing for JSX. If you or someone you know would like to contribute to Ludwig, please contact us! 

Visit the [Ludwig](www.ludwigvs.com) website to learn more.

# Set-Up

Ludwig is easily downloadable from the VS Code extensions marketplace. Simply search Ludwig and look for the logo above.

To start a Ludwig session, open the command palette and type [> Ludwig: Compose]. This will activate Ludwig, display highlights on any existing non-compliant HTML, and offer new highlights and feedback as you write. 

To take a break and deactivate the extension, type [> Ludwig: Caesura] into the command line. This will terminate the current session and deactivate highlighting and recommendations. 

![Compose Gif](./assets/ludwig-compose-caesura.gif)

To scan your document and generate your accessibility score, press the Ludwig logo on the activity bar (sidebar to the left), then press "Scan Document."

![Compose Gif](./assets/ludwig-scan-interface.gif)

# User Best Practices

Please note that Ludwig is currently in Beta and functions best when used with proper HTML formatting. Therefore, to ensure proper formatting, we recommend using a well-established linting tool such as Prettier.

# Open Source Work

| Feature / Bug                                               | Status      |
| ----------------------------------------------------------- | ----------- |
| Fix inconsistent highlights on parent elements              | In Progress |
| Expand coverage to JSX                                       | To-Do       |
| Expand coverage to non-serious/critical guidelines          | To-Do       |
| Replace an opened webview dashboard panel when clicking the "Scan Document" button in the sidebar | To-Do       |


# Licensing Info

MIT License

Copyright (c) 2023 OSLabs Beta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
