import generatedOfficialTests from "./generated/official-tests.json";
import type { TopicTest } from "./question-bank";

export interface OfficialInteractiveTest extends TopicTest {
  code: string;
  sourceFilename: string;
  assetPath: string;
}

export const officialInteractiveTests = generatedOfficialTests as OfficialInteractiveTest[];

const officialInteractiveTestsBySlug = officialInteractiveTests.reduce<Record<string, OfficialInteractiveTest>>(
  (accumulator, test) => {
    accumulator[test.slug] = test;
    return accumulator;
  },
  {},
);

export function getOfficialInteractiveTestBySlug(slug: string) {
  return officialInteractiveTestsBySlug[slug];
}
