const optionIds = ["a", "b", "c", "d"];

function stringToSeed(value) {
  let hash = 2166136261;

  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed) {
  return function random() {
    let next = (seed += 0x6d2b79f5);
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(values, seedLabel) {
  const cloned = [...values];
  const random = mulberry32(stringToSeed(seedLabel));

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
}

function buildBalancedAnswerKey(length, seedLabel) {
  const baseCount = Math.floor(length / optionIds.length);
  const remainder = length % optionIds.length;
  const counts = Object.fromEntries(optionIds.map((optionId) => [optionId, baseCount]));
  const extraOffset = stringToSeed(seedLabel) % optionIds.length;

  for (let index = 0; index < remainder; index += 1) {
    counts[optionIds[(extraOffset + index) % optionIds.length]] += 1;
  }

  return shuffleWithSeed(
    optionIds.flatMap((optionId) => Array.from({ length: counts[optionId] }, () => optionId)),
    `${seedLabel}-answer-key`,
  );
}

function rebalanceQuestions(questions, seedLabel) {
  const answerKey = buildBalancedAnswerKey(questions.length, seedLabel);

  return questions.map((question, index) => {
    const targetCorrectOption = answerKey[index];
    const correctOption = question.options.find((option) => option.id === question.correctOption);

    if (!correctOption) {
      return question;
    }

    const incorrectOptions = shuffleWithSeed(
      question.options.filter((option) => option.id !== question.correctOption),
      `${seedLabel}-${question.id}-incorrect`,
    );
    let incorrectIndex = 0;

    return {
      ...question,
      options: optionIds.map((optionId) => ({
        id: optionId,
        label: optionId === targetCorrectOption ? correctOption.label : incorrectOptions[incorrectIndex++].label,
      })),
      correctOption: targetCorrectOption,
    };
  });
}

function allocateQuestions(sources, size, seedLabel) {
  const allocations = Object.fromEntries(sources.map((source) => [source.code, 0]));
  const order = shuffleWithSeed(sources, `${seedLabel}-topic-order`);
  let remaining = size;

  while (remaining > 0) {
    let assignedInRound = 0;

    for (const source of order) {
      if (remaining === 0) {
        break;
      }

      if (allocations[source.code] < source.questions.length) {
        allocations[source.code] += 1;
        remaining -= 1;
        assignedInRound += 1;
      }
    }

    if (assignedInRound === 0) {
      break;
    }
  }

  return allocations;
}

/**
 * Creates a new mixed practice test from selected topic question banks.
 * Questions stay unique, subjects are shared as evenly as availability allows,
 * and the position of correct options is balanced across A/B/C/D.
 */
export function buildCustomTest(sources, { size = 50, seed = `${Date.now()}-${Math.random()}` } = {}) {
  const availableSources = sources.filter((source) => source.questions.length > 0);

  if (availableSources.length === 0) {
    throw new Error("Selecciona al menos un tema con preguntas disponibles.");
  }

  const availableQuestions = availableSources.reduce((total, source) => total + source.questions.length, 0);
  const targetSize = Math.max(1, Math.min(Math.floor(size), availableQuestions));
  const allocations = allocateQuestions(availableSources, targetSize, seed);
  const selectedQuestions = availableSources.flatMap((source) =>
    shuffleWithSeed(source.questions, `${seed}-${source.code}`)
      .slice(0, allocations[source.code])
      .map((question) => ({ ...question, topicCode: source.code })),
  );
  const mixedQuestions = shuffleWithSeed(selectedQuestions, `${seed}-question-order`);

  return {
    seed,
    requestedSize: size,
    questions: rebalanceQuestions(mixedQuestions, `${seed}-options`),
    allocations,
  };
}
