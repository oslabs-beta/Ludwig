const { evalAnchors } = require('./aria-standards/critical/anchor-labels.js'); // import anchor-labels file

export interface AriaRecommendations {
    [key: string]: string;
}

export async function compileLogic(): Promise<AriaRecommendations> {
    const ariaRecommendations: AriaRecommendations = {};

    const anchorsWithoutAriaLabel = await evalAnchors();
    console.log(anchorsWithoutAriaLabel);
    // other file functions here

    anchorsWithoutAriaLabel.forEach((element: string, index: number) => {
        ariaRecommendations[element] = 'ARIA Recommendation: [info to be defined later]';
    });
    

    // iterate through each here

    return ariaRecommendations;
}
