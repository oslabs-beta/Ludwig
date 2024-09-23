// Import the Mocha test framework
import * as Mocha from 'mocha';
// Import Node.js path module to handle file paths
import * as path from 'path';
// Import the glob module to find test files
import { glob } from 'glob';
// Import the run function from your test runner
import { run } from './index'; 

// Define a Mocha test suite
suite('Extension Test Suite', () => {
    // A test case within the suite
    test('Sample Test', () => {
        // Example assertion using Chai or Node's assert
        const expected = -1;
        const actual = [1, 2, 3].indexOf(4);
        if (actual !== expected) {
            throw new Error(`Expected indexOf(4) to be ${expected}, but got ${actual}`);
        }
    });

    // You can add more tests here or import them from other files
});




