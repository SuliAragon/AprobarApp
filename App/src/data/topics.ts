import generatedTopics from "./generated/temarios.json";
import generatedOfficialMaterials from "./generated/official-materials.json";
import { getOfficialInteractiveTestBySlug, type OfficialInteractiveTest } from "./official-tests";
import { buildTopicTests, type TopicTest } from "./question-bank";
import { questionBanksByCode } from "./question-banks";
import { topicOverrides } from "./topic-overrides";

export interface OfficialMaterial {
  code: string;
  slug: string;
  kind: "official-test" | "exercise" | "resource";
  sourceFilename: string;
  title: string;
  assetPath: string;
  interactiveTest?: OfficialInteractiveTest;
  hasInteractiveQuiz: boolean;
  interactiveQuestionCount: number;
}

export interface Topic {
  code: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  pdfPath: string;
  sourceFilename: string;
  summary: string[];
  sections: string[];
  accent: "emerald" | "amber" | "coral" | "azure";
  tests: TopicTest[];
  officialMaterials: OfficialMaterial[];
  questionCount: number;
  testCount: number;
  officialCount: number;
  officialTestsCount: number;
  exerciseCount: number;
  hasTests: boolean;
  hasOfficialMaterials: boolean;
}

interface GeneratedTopic {
  code: string;
  slug: string;
  title: string;
  pdfPath: string;
  sourceFilename: string;
}

const officialMaterialsByCode = (generatedOfficialMaterials as Omit<OfficialMaterial, "interactiveTest" | "hasInteractiveQuiz" | "interactiveQuestionCount">[]).reduce<
  Record<string, OfficialMaterial[]>
>((accumulator, material) => {
    const interactiveTest = getOfficialInteractiveTestBySlug(material.slug);
    const code = material.code || "SIN-CODIGO";
    accumulator[code] ??= [];
    accumulator[code].push({
      ...material,
      interactiveTest,
      hasInteractiveQuiz: Boolean(interactiveTest),
      interactiveQuestionCount: interactiveTest?.questions.length ?? 0,
    });
    return accumulator;
  },
  {},
);

export const topics: Topic[] = (generatedTopics as GeneratedTopic[]).map((topic) => {
  const override = topicOverrides[topic.code];
  const questionBank = questionBanksByCode[topic.code] ?? [];
  const tests = override ? buildTopicTests(topic.code, questionBank, override.testPresets) : [];
  const officialMaterials = (officialMaterialsByCode[topic.code] ?? []).sort((left, right) => {
    const order = { "official-test": 0, exercise: 1, resource: 2 };
    return order[left.kind] - order[right.kind] || left.title.localeCompare(right.title, "es");
  });
  const officialTestsCount = officialMaterials.filter((material) => material.kind === "official-test").length;
  const exerciseCount = officialMaterials.filter((material) => material.kind === "exercise").length;

  return {
    code: topic.code || "SIN-CODIGO",
    slug: topic.slug,
    title: override?.title ?? topic.title,
    shortTitle: override?.shortTitle ?? topic.title,
    description:
      override?.description ??
      "Tema detectado automáticamente. El PDF ya está disponible en la app y se puede ampliar con tests específicos.",
    pdfPath: topic.pdfPath,
    sourceFilename: topic.sourceFilename,
    summary:
      override?.summary ??
      ["Tema sincronizado desde la carpeta Temario.", "Añade un banco de preguntas para activar los tests específicos."],
    sections: override?.sections ?? ["Temario en revisión"],
    accent: override?.accent ?? "amber",
    tests,
    officialMaterials,
    questionCount: questionBank.length,
    testCount: tests.length,
    officialCount: officialMaterials.length,
    officialTestsCount,
    exerciseCount,
    hasTests: tests.length > 0,
    hasOfficialMaterials: officialMaterials.length > 0,
  };
});

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getTopicByCode(code: string) {
  return topics.find((topic) => topic.code === code);
}
