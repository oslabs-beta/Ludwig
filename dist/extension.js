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
    // Register the hover provider for HTML
    let htmlDisposable = vscode.languages.registerHoverProvider('html', {
        provideHover(document, position, token) {
            console.log('I am hovering!');
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            console.log(word, typeof word);
            let link = '';
            if (word === 'test') {
                link = 'www.google.com'
            } else if (word === 'html') {
                link = 'www.wikipedia.com'
            }
            const hoverContent = new vscode.MarkdownString(`[${word}](command:extension.showModal) ${link}`);
            return new vscode.Hover(hoverContent, range);
        }
    });
    context.subscriptions.push(htmlDisposable);
    // Register the hover provider for plaintext
    let plaintextDisposable = vscode.languages.registerHoverProvider('plaintext', {
        provideHover(document, position, token) {
            console.log('I am hovering!');
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            const hoverContent = new vscode.MarkdownString(`[${word}](command:extension.showModal)`);
            return new vscode.Hover(hoverContent, range);
        }
    });
    context.subscriptions.push(plaintextDisposable);
    // Register the command to show the modal
    let commandDisposable = vscode.commands.registerCommand('extension.showModal', () => {
        console.log('I am a Modal!');
        vscode.window.showInformationMessage('Modal triggered with word: ' + getCurrentWord());
    });
    context.subscriptions.push(commandDisposable);
}
exports.activate = activate;
function getCurrentWord() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        const wordRange = editor.document.getWordRangeAtPosition(selection.start);
        if (wordRange) {
            return editor.document.getText(wordRange);
        }
    }
    return undefined;
}
// This method is called when your extension is deactivated
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