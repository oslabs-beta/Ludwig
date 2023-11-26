const { evalAnchors } = require('./aria-standards/critical/anchor-labels.js'); // import anchor-labels file

export interface AriaRecommendations {
    [key: string]: string;
}

export async function compileLogic(): Promise<AriaRecommendations> {
    const anchorsWithoutAriaLabel = await evalAnchors();
    const ariaRecommendations: AriaRecommendations = {};

    anchorsWithoutAriaLabel.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });

    return ariaRecommendations;
}
