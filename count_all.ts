import * as ex from './src/data/exercises';

const arrays = [
  'linkedListExercises', 'stackExercises', 'queueExercises', 'treeExercises',
  'graphExercises', 'sortExercises', 'searchExercises', 'dpExercises',
  'introExercises', 'hashExercises', 'stringExercises', 'twoPointerExercises',
  'slidingWindowExercises', 'bitExercises', 'greedyExercises', 'backtrackExercises',
  'classicDpExercises', 'mathExercises', 'moreLinkedListExercises', 'moreTreeExercises',
  'moreFillBlankExercises', 'heapExercises', 'arrayExercises', 'matrixExercises',
  'intervalExercises', 'moreGraphExercises', 'leetcodeClassicExercises', 'classicDpProblems',
  'designExercises', 'moreStringExercises', 'unionFindExercises', 'monotoneStackExercises',
  'prefixSumExercises', 'moreBinarySearchExercises', 'moreBacktrackExercises',
  'moreGreedyExercises', 'moreDpExercises', 'extraFillBlankExercises', 'examFocusExercises'
];

let total = 0;
for (const name of arrays) {
  const arr = (ex as any)[name];
  if (arr) {
    console.log(`${name}: ${arr.length}`);
    total += arr.length;
  } else {
    console.log(`${name}: 未导出!`);
  }
}

import { allClassicExercises } from './src/data/classicExercises';
console.log(`allClassicExercises: ${allClassicExercises.length}`);
total += allClassicExercises.length;

console.log(`\n各数组总和: ${total}`);
console.log(`allExercises: ${ex.allExercises.length}`);
