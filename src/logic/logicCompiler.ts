/* eslint-disable @typescript-eslint/no-var-requires */

interface LintIssue {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  nodeType?: string;
  customSeverity?: number;
}

interface LintResult {
  summary: {
    dateCreated: string;
    timeCreated: string;
    activeWorkspace: string;
    filepath: string;
    errors: number;
    warnings: number;
  };
  details: LintIssue[];
}

// import { strict } from 'assert';
import { ariaObject } from './aria-standards/aria-object';
import * as Critical from './aria-standards/critical';
import * as vscode from 'vscode';
const { JSDOM } = require('jsdom');

export interface AriaRecommendations {
  [key: string]: any;
  totalElements: number;
}

export function cloneDomFromSource(source: any) {
  const htmlCode = addLineNumbersToHtml(source.document.getText());
  const { window } = new JSDOM(htmlCode, {
    url: 'http://ciafund.gov',
    pretendToBeVisual: true,
    includeNodeLocations: true,
  });
  const document = window.document;
  const body = window.document.body;
  return { document, body };
}

export async function compileLogic(activeEditor: vscode.TextEditor) {
  const ariaRecommendations: AriaRecommendations = {
    totalElements: 0,
  };
  const { document, body } = cloneDomFromSource(activeEditor);
  function tag(element: any) {
    return body.querySelectorAll(element);
  }

  ariaRecommendations.anchorLabel = Critical.anchorLabelCheck(tag('a'));
  ariaRecommendations.areaAltText = Critical.areaAltTextCheck(tag('area'));
  ariaRecommendations.ariaHidden = Critical.ariaHiddenCheck(tag('*'));
  ariaRecommendations.discernibleButtonText = Critical.discernibleButtonTextCheck(tag('button'));
  ariaRecommendations.uniqueIDs = Critical.uniqueIDsCheck(tag('[id]'));
  ariaRecommendations.imageAlts = Critical.imageAltsCheck(tag('img'));
  ariaRecommendations.inputButton = Critical.inputButtonCheck(tag('input'));
  ariaRecommendations.metaEquivRefresh = Critical.metaEquivRefreshCheck(tag('meta'));
  ariaRecommendations.metaViewport = Critical.metaViewportCheck(tag('meta[name="viewport"]'));
  ariaRecommendations.selectHasAccessName = Critical.selectHasAccessNameCheck(tag('select'));
  ariaRecommendations.videoCaptions = Critical.videoCaptionsCheck(tag('video'));
  ariaRecommendations.formsHaveLabels = Critical.formsHaveLabelsCheck(tag('form'));

  const details: LintIssue[] = [];

  let errors = 0;
  const warnings = 0;
  // const filePath = document.fileName;

  for (const [key, value] of Object.entries(ariaRecommendations)) {
    value.forEach((ariaIssue: any) => {
      const description: string = ariaObject[key].desc;
      const issue: LintIssue = {
        ruleId: key,
        severity: 2,
        message: description,
        line: ariaIssue[0],
        column: 0,
        endLine: ariaIssue[0],
        endColumn: 100,
        nodeType: 'node',
        customSeverity: 10,
      };
      details.push(issue);
      errors++;
    });
  }

  const lintResult: LintResult = {
    summary: {
      dateCreated: new Date().toISOString().split('T')[0],
      timeCreated: new Date().toTimeString().split(' ')[0],
      activeWorkspace: vscode.workspace.name || 'Unknown',
      filepath: document.uri.fsPath,
      errors,
      warnings,
    },
    details,
  };

  ariaRecommendations.criticalIssuesByType = {};
  for (const key in ariaRecommendations) {
    if (key !== 'totalElements' && key !== 'criticalIssuesByType') {
      ariaRecommendations.criticalIssuesByType[key] = ariaRecommendations[key].length;
    }
  }

  ariaRecommendations.totalElements = body.querySelectorAll('*').length;

  const compileResult = [ariaRecommendations, lintResult];
  return compileResult;
}

function addLineNumbersToHtml(htmlCode: string) {
  const lines = htmlCode.split('\n');
  for (let i = 0; i < lines.length; i++) {
    lines[i] += `<!-- html line number: ${i + 1} -->`;
  }
  return lines.join('\n');
}
