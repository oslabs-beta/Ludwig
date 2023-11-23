/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
function activate(context) {
    console.log('Congratulations, your extension "ludwig" is now active!');
    // Map to track highlighted HTML elements and their positions
    const highlightedElements = new Map();
    // Function to highlight lines containing "div"
    function highlightElements(document) {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const highlightedRanges = [];
            // Loop through each line in the document
            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
                const line = document.lineAt(lineNumber);
                const lineText = line.text.toLowerCase(); // Convert to lowercase for case-insensitive check
                // Check if the line contains "div"
                if (lineText.includes('div')) {
                    // Create a range for the entire line
                    const lineRange = new vscode.Range(line.range.start, line.range.end);
                    highlightedRanges.push(lineRange);
                }
            }
            // Store the highlighted ranges in the map
            highlightedElements.set('div', highlightedRanges);
            // Apply the decorations to highlight the lines
            const decorationType = vscode.window.createTextEditorDecorationType({
                isWholeLine: true,
                overviewRulerLane: vscode.OverviewRulerLane.Right,
                overviewRulerColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
            });
            activeEditor.setDecorations(decorationType, highlightedRanges);
        }
    }
    // Register onDidChangeTextDocument event to trigger highlighting when the document changes
    let documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'html') {
            highlightElements(event.document);
        }
    });
    // Register onDidChangeActiveTextEditor event to trigger highlighting when the active editor changes
    let activeEditorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'html') {
            highlightElements(editor.document);
        }
    });
    // Command to trigger the highlighting functionality
    let highlightCommandDisposable = vscode.commands.registerCommand('ludwig.highlightElements', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'html') {
            const document = activeEditor.document;
            highlightElements(document);
        }
    });
    // Register onDidOpenTextDocument event to immediately highlight elements when an HTML file is opened
    let documentOpenDisposable = vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === 'html') {
            highlightElements(document);
        }
    });
    // Hover provider to show a popup window with ARIA recommendations
    let hoverProviderDisposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'html' }, {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position, /<\w+>/);
            if (wordRange) {
                const word = document.getText(wordRange).toLowerCase(); // Convert to lowercase for case-insensitive check
                // Check if the element has been highlighted
                const highlightedRanges = highlightedElements.get('div'); // Check for 'div' since that's what we are currently highlighting
                if (highlightedRanges && highlightedRanges.some((range) => range.contains(wordRange))) {
                    // Define the ARIA recommendation information based on the highlighted element
                    const ariaRecommendationInfo = 'ARIA recommendation: [info to be defined later]';
                    const hoverMessage = new vscode.MarkdownString(ariaRecommendationInfo);
                    return new vscode.Hover(hoverMessage, wordRange);
                }
            }
            return null;
        }
    });
    context.subscriptions.push(highlightCommandDisposable, documentOpenDisposable, hoverProviderDisposable, documentChangeDisposable, activeEditorChangeDisposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map