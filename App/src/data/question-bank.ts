export type OptionId = "a" | "b" | "c" | "d";

import { rebalanceQuestionsForTest } from "./test-option-balancer.ts";

export interface QuestionOption {
  id: OptionId;
  label: string;
}

export interface QuizQuestion {
  id: string;
  section: string;
  prompt: string;
  options: QuestionOption[];
  correctOption: OptionId;
  explanation: string;
}

export interface TestPreset {
  slug: string;
  title: string;
  description: string;
  focusSections: string[];
  size?: number;
}

export interface TopicTest {
  slug: string;
  title: string;
  description: string;
  focusSections: string[];
  questions: QuizQuestion[];
}

export type RawQuestion = [
  id: string,
  section: string,
  prompt: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
];

const optionIds: OptionId[] = ["a", "b", "c", "d"];

export function createQuestionBank(_topicCode: string, rawQuestions: RawQuestion[]): QuizQuestion[] {
  return rawQuestions.map(([id, section, prompt, options, correctIndex, explanation]) => ({
    id,
    section,
    prompt,
    options: options.map((label, index) => ({
      id: optionIds[index],
      label,
    })),
    correctOption: optionIds[correctIndex],
    explanation,
  }));
}

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

export function buildTopicTests(topicCode: string, bank: QuizQuestion[], presets: TestPreset[], size = 50) {
  return presets.map((preset) => {
    const targetSize = preset.size ?? size;
    const focusQuestions = shuffleWithSeed(
      bank.filter((question) => preset.focusSections.includes(question.section)),
      `${topicCode}-${preset.slug}-focus`,
    );
    const otherQuestions = shuffleWithSeed(
      bank.filter((question) => !preset.focusSections.includes(question.section)),
      `${topicCode}-${preset.slug}-other`,
    );

    const selected: QuizQuestion[] = [];
    const seenIds = new Set<string>();

    for (const question of [...focusQuestions, ...otherQuestions]) {
      if (!seenIds.has(question.id)) {
        selected.push(question);
        seenIds.add(question.id);
      }

      if (selected.length === targetSize) {
        break;
      }
    }

    return {
      slug: preset.slug,
      title: preset.title,
      description: preset.description,
      focusSections: preset.focusSections,
      questions: rebalanceQuestionsForTest(selected, `${topicCode}-${preset.slug}`),
    } satisfies TopicTest;
  });
}
