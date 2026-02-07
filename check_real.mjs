// 使用tsx运行TypeScript
import { execSync } from 'child_process';

const code = `
import { allExercises, linkedListExercises, stackExercises, queueExercises, treeExercises, graphExercises, sortExercises, searchExercises, dpExercises, introExercises, hashExercises, stringExercises, twoPointerExercises, slidingWindowExercises, bitExercises, greedyExercises, backtrackExercises, classicDpExercises, mathExercises, moreLinkedListExercises, moreTreeExercises, moreFillBlankExercises, heapExercises, arrayExercises, matrixExercises, intervalExercises, moreGraphExercises, leetcodeClassicExercises, classicDpProblems, designExercises, moreStringExercises, unionFindExercises, monotoneStackExercises, prefixSumExercises, moreBinarySearchExercises, moreBacktrackExercises, moreGreedyExercises, moreDpExercises, extraFillBlankExercises, examFocusExercises } from './src/data/exercises';
import { allClassicExercises } from './src/data/classicExercises';

const arrays = {
  linkedListExercises,
  stackExercises,
  queueExercises,
  treeExercises,
  graphExercises,
  sortExercises,
  searchExercises,
  dpExercises,
  introExercises,
  hashExercises,
  stringExercises,
  twoPointerExercises,
  slidingWindowExercises,
  bitExercises,
  greedyExercises,
  backtrackExercises,
  classicDpExercises,
  allClassicExercises,
  mathExercises,
  moreLinkedListExercises,
  moreTreeExercises,
  moreFillBlankExercises,
  heapExercises,
  arrayExercises,
  matrixExercises,
  intervalExercises,
  moreGraphExercises,
  leetcodeClassicExercises,
  classicDpProblems,
  designExercises,
  moreStringExercises,
  unionFindExercises,
  monotoneStackExercises,
  prefixSumExercises,
  moreBinarySearchExercises,
  moreBacktrackExercises,
  moreGreedyExercises,
  moreDpExercises,
  extraFillBlankExercises,
  examFocusExercises
};

let total = 0;
for (const [name, arr] of Object.entries(arrays)) {
  console.log(name + ': ' + arr.length);
  total += arr.length;
}
console.log('\\n各数组总和: ' + total);
console.log('allExercises: ' + allExercises.length);
`;

console.log('检查中...');
