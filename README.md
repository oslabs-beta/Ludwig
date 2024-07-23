<p align="center"><img src="./assets/Ludwing-Logo-Detailed.png" width='200' style="margin-top: 10px; margin-bottom: 15px;"></p>

# Ludwig VS

Ludwig VS is a VS Code linter that makes writing accessible HTML and JSX easier for developers. Ludwig offers linting of HTML and JSX files that are not in compliance with WCAG and WAI-ARIA AA standards and provides recommendations to enhance the accessibility of your code. Additionally, it creates a chart in a dashboard to show the number of accessibilty errors and warnings over time with real-time updates to track progress save historical data.

One sixth of the world’s population will experience a disability at some point in their lifetime, but 98% of websites contain inaccessibility issues, making them challenging for individuals with disabilities to use. Ludwig tackles this problem directly by providing a reliable tool that developers can leverage during the development process, rather than relying solely on post-development accessibility testing. Ludwig annotates HTML and JSX accessibility errors in real-time, such as missing ARIA-attributes or ensuring all interactive elements are accessible via keyboard. As well, the Ludwig dashboard panel offers a real-time overview of the errors in a developer’s code and provides line by line information for the developer to gauge and improve their web content’s accessibility.

Ludwig tests HTML and JSX for over 100 of the most critical and common accessibility guidelines outlined by WAI-ARIA. We still plan on expanding Ludwig’s capabilities to provide coverage for all guidelines as well as by providing more robust data visualizations. If you or someone you know would like to contribute to Ludwig, please contact us!

Visit the [Ludwig](https://www.ludwigvs.com) website to learn more.

# Set-Up

Download Ludwig VS from the VS Code extensions marketplace.

To start Ludwig, navigate to the document that you want scanned and click on "Ludwig: Disabled" to enable it. This should pop up a drop down menu from the command palette with these options:

___________________________add picture of commands in  palette-------------------------------------
<br><br><font color="gold"> Lint Active File (Toggle)<br> Lint All Files (Toggle) <br> Disable Linting (Toggle) <br> Update Dashboard / Generate Report <br> Reset Library </font></b><br>

Errors and warnings found in current active editor will be reported in the 'Problems' tab in the bottom panel, in addition to highlighting the line where the error was found. 

--------------need to update with gifs of finished product:---------------------------------------

<p align="center"><img src="./assets/ludwig-compose-caesura.gif" width='600' style="margin-top: 1em; margin-bottom: 1em;"></p>

To scan your document and generate your accessibility score,run the command "Update Dashboard / Generate Report", then press "Scan Document."

<p align="center"><img src="./assets/ludwig-scan-interface.gif" width='600' style="margin-top: 1em; margin-bottom: 1em;"></p>

--------------------------------------------------------------------------------------------------

# Deep Dive
Powered by ESlint: <br>
Ludwig utilizes the JSX a11y ESLint plugin to parse through the user's codebase and extract accessibility errors/warnings using a custom formatter. [Read More](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#readme)

Logic behind Accessibility Score: <br>
Referenced Google Lighthouse's accessibility severity weighting and implemented the 

# User Best Practices

Please note that Ludwig is currently in Beta and functions best when used with proper HTML and JSX formatting. Therefore, to ensure proper formatting, please use a well-established linting tool such as [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

# Open Source Work

| Feature / Bug                                          | Status      |
| --------------------------------------------------     | ----------- |
| Create further dashboard tools for data visulizations  | In progress |
| Prioritize errors and warnings based on severity score | To-Do       |
| Integrate AI tools to help automate error fixing       | To-Do       |
   
# Contributors
Version 2.0 Team: <br>
Anar Gasimov | [LinkedIn](https://www.linkedin.com/in/anargasimov/) <br>
Benson Cheng | [LinkedIn](https://www.linkedin.com/in/bensonhpcheng/) <br>
Kristian Schott | [LinkedIn](https://www.linkedin.com/in/kristian-schott/) <br>
Saagar Mehta | [LinkedIn](https://www.linkedin.com/in/saagar-mehta-a86981110/) <br>
Spencer Hezzelwood | [LinkedIn](https://www.linkedin.com/in/spencer-lane-hezzelwood-650b9a19/) <br>

Version 1.0 Team: <br>
Connie Johnson | [LinkedIn](https://www.linkedin.com/in/connie-johnson-7a33152a4) <br>
Harold Reeves | [LinkedIn](https://www.linkedin.com/in/haroldreeves/) <br>
Jake Johnson | [LinkedIn](https://www.linkedin.com/in/jake527/) <br>
Prashay Mehta | [LinkedIn](https://www.linkedin.com/in/prashaymehta/) <br>
Tyler Spicer | [LinkedIn](https://www.linkedin.com/in/tyler-e-spicer/) <br>

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