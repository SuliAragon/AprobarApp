const optionIds = ["a", "b", "c", "d"] as const;

type OptionId = (typeof optionIds)[number];

type BalanceableQuestion = {
  id: string;
  options: Array<{ id: OptionId; label: string }>;
  correctOption: OptionId;
};

function stringToSeed(value: string) {
  let hash = 2166136261;

  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function random() {
    let next = (seed += 0x6d2b79f5);
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(values: T[], seedLabel: string) {
  const cloned = [...values];
  const random = mulberry32(stringToSeed(seedLabel));

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
}

function buildBalancedAnswerKey(length: number, seedLabel: string): OptionId[] {
  const baseCount = Math.floor(length / optionIds.length);
  const remainder = length % optionIds.length;
  const extraOffset = stringToSeed(seedLabel) % optionIds.length;
  const counts = Object.fromEntries(optionIds.map((optionId) => [optionId, baseCount])) as Record<OptionId, number>;

  for (let index = 0; index < remainder; index += 1) {
    counts[optionIds[(extraOffset + index) % optionIds.length]] += 1;
  }

  const answerKey = optionIds.flatMap((optionId) => Array.from({ length: counts[optionId] }, () => optionId));
  return shuffleWithSeed(answerKey, `${seedLabel}-answer-key`);
}

export function rebalanceQuestionsForTest<T extends BalanceableQuestion>(questions: T[], seedLabel: string): T[] {
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
    const balancedOptions = optionIds.map((optionId) => ({
      id: optionId,
      label: optionId === targetCorrectOption ? correctOption.label : incorrectOptions[incorrectIndex++].label,
    }));

    return {
      ...question,
      options: balancedOptions,
      correctOption: targetCorrectOption,
    };
  });
}
