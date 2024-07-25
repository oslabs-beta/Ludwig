<p align="center"><img src="./assets/Ludwing-Logo-Detailed.png" width='200' style="margin-top: 10px; margin-bottom: 15px;"></p>

# Ludwig VS

**Ludwig VS** is a Visual Studio Code linter designed to help developers write accessible HTML and JSX. Ludwig ensures compliance with WCAG and WAI-ARIA AA standards by providing real-time linting, error annotations, and recommendations for improving code accessibility. Additionally, it offers a dashboard that visualizes the number of accessibility errors and warnings over time, allowing developers to track progress and save historical data.

One sixth of the world’s population will experience a disability at some point in their lifetime, yet 98% of websites contain accessibility issues, making them challenging for individuals with disabilities to use. Ludwig directly addresses this problem by integrating into the development process, rather than relying solely on post-development accessibility testing. It annotates HTML and JSX accessibility errors in real-time, such as missing ARIA attributes or inaccessible interactive elements via keyboard. The Ludwig dashboard provides a real-time overview of code errors and offers detailed information to help developers enhance their web content’s accessibility.

Ludwig tests HTML and JSX against over 100 critical accessibility guidelines outlined by WAI-ARIA. We plan to expand Ludwig’s capabilities to cover all guidelines and provide more robust data visualizations. If you or someone you know would like to contribute to Ludwig, please contact us!

Visit the [Ludwig](https://www.ludwigvs.com) website to learn more.

# Set-Up

Download Ludwig VS from the VS Code extensions marketplace.

To start Ludwig, navigate to the document that you want scanned and click on "Ludwig: Disabled" on the bottom status bar to enable it. This should pop up a drop down menu from the command palette with these options:

<p align="center"><img src="./assets/SeymourOptionsMenu.jpeg" width='600' style="margin-top: 1em; margin-bottom: 1em;"></p>

Errors and warnings found in current active editor will be reported in the 'Problems' tab in the bottom panel, in addition to highlighting the line where the error was found. 


**In order to populate Dashboard with historical scan results:**
1. Open HTML/JSX Document where you want to scan for accessibility issues.
2. Select "Lint Active Files" to save scan results in local JSON library.
3. Continue editing the file as needed.
4. Select "Update Dashboard/Generate Report" to see new changes reflected on progression chart. 

**Note:** <br/>
- If there are no changes between updates to the dashboard, no new plots will appear on the chart.  <br/>
- Each file has its own separate local JSON library, located in the Summary_Library folder created when "Lint Active File" is triggered. This library stores the linting data for that specific file.

<p align="center"><img src="./assets/showChartSpeed.gif" width='800' style="margin-top: 1em; margin-bottom: 1em;" autoplay></p>

# Deep Dive
**Powered by ESlint:**
Ludwig utilizes the JSX a11y ESLint plugin to parse through the user's codebase and extract accessibility errors/warnings using a custom formatter. [JSX A11Y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#readme)


**Accessibility Score Calculation:**
To determine a fair percentage of accessibility for a document, we referenced Google Lighthouse's weighted scoring system that considers the severity and frequency of accessibility issues. On top of that foundation we also considered the size of the document. This approach ensures a balanced and comprehensive measure of accessibility compliance.

The following logic governs how the accessibility score is calculated: <br/>
1. Assign Weights to Different severities (W)
2. Count Issues for each severity (C)
3. Calculate Total Weighted Score: </br>

<p align='center'> Total Score = (W<sub>1</sub>* C<sub>1</sub>) + (W<sub>2</sub>* C<sub>2</sub>)... +(W<sub>n</sub> * C<sub>n</sub>) <p/>

4. Determine the overall compliance percentage by considering the total number of elements and the number of non-compliant elements in the document:
<p align="center"><img src="./assets/CompliancePercentage.jpg" width='600' style="margin-top: 1em; margin-bottom: 1em;"></p>
5. Normalize the score to account for the size of the document and adjust the compliance percentage:
<p align="center"><img src="./assets/Normalized&Adjusted.jpg" width='600' style="margin-top: 1em; margin-bottom: 1em;"></p>


**The table below shows the corresponding weights (W) to each accessibility warning/error.**

|    JSX Rules    | Custom Severity (W) |
|-----------------|----------------------|
| 'jsx-a11y/alt-text' | 10 |
| 'jsx-a11y/anchor-has-content' | 10 |
| 'jsx-a11y/interactive-supports-focus' | 10 |
| 'jsx-a11y/heading-has-content' | 9 |
| 'jsx-a11y/label-has-associated-control' | 9 |
| 'jsx-a11y/media-has-caption' | 9 |
| 'jsx-a11y/anchor-is-valid' | 8 |
| 'jsx-a11y/aria-role' | 8 |
| 'jsx-a11y/aria-unsupported-elements' | 8 |
| 'jsx-a11y/no-interactive-element-to-noninteractive-role' | 8 |
| 'jsx-a11y/role-has-required-aria-props' | 8 |
| 'jsx-a11y/aria-props' | 7 |
| 'jsx-a11y/aria-proptypes' | 7 |
| 'jsx-a11y/iframe-has-title' | 7 |
| 'jsx-a11y/mouse-events-have-key-events' | 7 |
| 'jsx-a11y/no-noninteractive-element-interactions' | 7 |
| 'jsx-a11y/no-noninteractive-element-to-interactive-role' | 7 |
| 'jsx-a11y/role-supports-aria-props' | 7 |
| 'jsx-a11y/click-events-have-key-events' | 6 |
| 'jsx-a11y/aria-activedescendant-has-tabindex' | 6 |
| 'jsx-a11y/no-distracting-elements' | 6 |
| 'jsx-a11y/no-noninteractive-tabindex' | 6 |
| 'jsx-a11y/no-static-element-interactions' | 6 |
| 'jsx-a11y/scope' | 6 |
| 'jsx-a11y/tabindex-no-positive' | 6 |
| 'jsx-a11y/html-has-lang' | 5 |
| 'jsx-a11y/img-redundant-alt' | 5 |
| 'jsx-a11y/lang' | 5 |
| 'jsx-a11y/no-access-key' | 5 |
| 'jsx-a11y/no-redundant-roles' | 5 |
| 'jsx-a11y/no-autofocus' | 4 |
| 'jsx-a11y/no-onchange' | 4 |

# User Best Practices

Please note that Ludwig is currently in Beta and functions best when used with proper HTML and JSX formatting. Therefore, to ensure proper formatting, please use a well-established linting tool such as [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

# Open Source Work

| Feature / Bug                                                 | Status      |
| --------------------------------------------------            | ----------- |
| Create further dashboard tools for data visulizations         | In progress |
| Prioritize errors and warnings based on custom severity score | To-Do       |
| Integrate AI tools to help automate error fixing              | To-Do       |
   
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