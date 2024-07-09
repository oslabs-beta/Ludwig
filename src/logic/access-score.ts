import { getDocument } from './logicCompiler';

export function getAccessScore(recs: any): { x: string; y: number }[] {
  const document = getDocument();

  const { body } = document;
  const totalElements = body.getElementsByTagName('*').length;

  const accessibleCount = totalElements - Object.keys(recs).length;

  return [
    { x: 'Accessible', y: accessibleCount },
    { x: 'Inaccessible', y: totalElements - accessibleCount },
  ];
}
