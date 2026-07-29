import generatedOfficialTests from "./generated/official-tests.json";
import { withB2T4Explanation } from "./b2t4-explanations";
import type { TopicTest } from "./question-bank";

export interface OfficialInteractiveTest extends TopicTest {
  code: string;
  sourceFilename: string;
  assetPath: string;
}

export const officialInteractiveTests = (generatedOfficialTests as OfficialInteractiveTest[]).map((test) =>
  test.code === "B2T4"
    ? { ...test, questions: test.questions.map(withB2T4Explanation) }
    : test,
);

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
