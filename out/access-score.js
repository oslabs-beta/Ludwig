"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAccessScore;
const vscode = __importStar(require("vscode"));
const jsdom_1 = require("jsdom");
function getAccessScore(recs) {
    // Get the active text editor from VS Code
    const activeEditor = vscode.window.activeTextEditor;
    // Check if there is an active editor and it has a document
    if (activeEditor && activeEditor.document) {
        // Get the HTML code from the active document
        const htmlCode = activeEditor.document.getText();
        // Create a virtual DOM using JSDOM
        const { window } = new jsdom_1.JSDOM(htmlCode);
        const document = window.document;
        // Calculate the total number of elements in the HTML document
        const totalElements = Array.from(document.querySelectorAll('*')).length;
        // Calculate the total number of Aria recommendations
        const totalRecs = Object.keys(recs).length;
        // Calculate the Accessible and Inaccessible counts
        const accessibleCount = totalElements - totalRecs;
        const inaccessibleCount = totalRecs;
        return [
            { x: 'Accessible', y: accessibleCount },
            { x: 'Inaccessible', y: inaccessibleCount }
        ];
    }
    else {
        // Handle the case when there is no active editor or document
        throw new Error('No active editor or document found.');
    }
}
//# sourceMappingURL=access-score.js.map