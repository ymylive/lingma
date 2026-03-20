import type { Exercise } from '../exercises';

type ExerciseBankLoader = () => Promise<Exercise[]>;

function dedupeExercisesById(exercises: Exercise[]): Exercise[] {
  const seen = new Set<string>();

  return exercises.filter((exercise) => {
    if (seen.has(exercise.id)) {
      return false;
    }

    seen.add(exercise.id);
    return true;
  });
}

function createCachedLoader(loader: ExerciseBankLoader): ExerciseBankLoader {
  let pending: Promise<Exercise[]> | null = null;

  return async () => {
    if (!pending) {
      pending = loader().catch((error) => {
        pending = null;
        throw error;
      });
    }

    return pending;
  };
}

const loadFoundationsBank = createCachedLoader(async () => {
  const module = await import('./foundations');
  return module.foundationsExerciseBank;
});

const loadPatternsBank = createCachedLoader(async () => {
  const module = await import('./patterns');
  return module.patternsExerciseBank;
});

const loadStructuresBank = createCachedLoader(async () => {
  const module = await import('./structures');
  return module.structuresExerciseBank;
});

const loadBasicsBank = createCachedLoader(async () => {
  const module = await import('./basics');
  return module.basicsExerciseBank;
});

const loadClassicBank = createCachedLoader(async () => {
  const module = await import('../classicExercises');
  return module.allClassicExercises;
});

const loadDigitalLogicBank = createCachedLoader(async () => {
  const module = await import('../digitalLogicExercises');
  return module.digitalLogicExamExercises;
});

const loadMoreArray2DBank = createCachedLoader(async () => {
  const module = await import('../moreArray2DExercises');
  return module.moreArray2DExercises;
});

let allExercisesPromise: Promise<Exercise[]> | null = null;

export async function loadAllExercises(): Promise<Exercise[]> {
  if (!allExercisesPromise) {
    allExercisesPromise = Promise.all([
      loadFoundationsBank(),
      loadPatternsBank(),
      loadStructuresBank(),
      loadBasicsBank(),
      loadClassicBank(),
      loadDigitalLogicBank(),
      loadMoreArray2DBank(),
    ])
      .then((banks) => dedupeExercisesById(banks.flat()))
      .catch((error) => {
        allExercisesPromise = null;
        throw error;
      });
  }

  return allExercisesPromise;
}

export function preloadAllExercises() {
  void loadAllExercises();
}
