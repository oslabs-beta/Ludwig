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

import { ariaObject } from './aria-standards/aria-object';
import * as Critical from './aria-standards/critical';
import * as vscode from 'vscode';
const { JSDOM } = require('jsdom');

export interface AriaRecommendations {
  [key: string]: any;
  totalElements: number;
}

export function cloneDomFromSource(doc: any) {
  const htmlCode = addLineNumbersToHtml(doc.getText());
  const { window } = new JSDOM(htmlCode, {
    url: 'http://ciafund.gov',
    pretendToBeVisual: true,
    includeNodeLocations: true,
  });
  const document = window.document;
  const body = window.document.body;
  return { document, body };
}

export async function compileLogic(doc: vscode.TextDocument) {
  const ariaRecommendations: AriaRecommendations = {
    totalElements: 0,
  };
  const { body } = cloneDomFromSource(doc);
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

  console.log('Compiling logic...');
  for (const [key, value] of Object.entries(ariaRecommendations)) {
    if (key === 'totalElements' || key === 'criticalIssuesByType') {
      continue;
    }
    console.log(`Checking ${key}...`);
    for (const ariaIssue of value) {
      console.log(`CompileLogic line 83, ariaIssue: ${ariaIssue}`);
      const issue: LintIssue = {
        ruleId: key,
        severity: 2,
        message: ariaObject[key].desc,
        line: ariaIssue[0],
        column: doc.lineAt(Number(ariaIssue[0]) - 1).firstNonWhitespaceCharacterIndex,
        endLine: ariaIssue[0],
        endColumn: 100,
      };
      details.push(issue);
      errors++;
    }
  }

  const lintResult: LintResult = {
    summary: {
      dateCreated: new Date().toISOString().split('T')[0],
      timeCreated: new Date().toTimeString().split(' ')[0],
      activeWorkspace: vscode.workspace.name || 'Unknown',
      filepath: doc.uri.fsPath,
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

  return lintResult;
}

function addLineNumbersToHtml(htmlCode: string) {
  const lines = htmlCode.split('\n');
  for (let i = 0; i < lines.length; i++) {
    lines[i] += `<!-- html line number: ${i + 1} -->`;
  }
  return lines.join('\n');
}
