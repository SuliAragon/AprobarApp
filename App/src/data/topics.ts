import generatedTopics from "./generated/temarios.json";
import generatedOfficialMaterials from "./generated/official-materials.json";
import { getOfficialInteractiveTestBySlug, type OfficialInteractiveTest } from "./official-tests";
import { buildTopicTests, type TopicTest } from "./question-bank";
import { questionBanksByCode } from "./question-banks";
import { buildTopicNavigator, parseTopicCode } from "./topic-catalog.js";
import { topicOverrides } from "./topic-overrides";
import { buildVersionedAssetPath } from "../utils/versioned-asset-path";

export interface TopicPodcast {
  sourceFilename: string;
  title: string;
  assetPath: string;
}

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
  blockNumber: number | null;
  topicNumber: number | null;
  blockLabel: string;
  topicLabel: string;
  title: string;
  shortTitle: string;
  description: string;
  pdfPath: string;
  pdfAssetPath: string;
  sourceFilename: string;
  podcasts: TopicPodcast[];
  podcastCount: number;
  hasPodcasts: boolean;
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
  podcasts?: TopicPodcast[];
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

export const topics: Topic[] = (generatedTopics as GeneratedTopic[])
  .map((topic) => {
  const override = topicOverrides[topic.code];
  const questionBank = questionBanksByCode[topic.code] ?? [];
  const tests = override ? buildTopicTests(topic.code, questionBank, override.testPresets) : [];
  const officialMaterials = (officialMaterialsByCode[topic.code] ?? []).sort((left, right) => {
    const order = { "official-test": 0, exercise: 1, resource: 2 };
    return order[left.kind] - order[right.kind] || left.title.localeCompare(right.title, "es");
  });
  const officialTestsCount = officialMaterials.filter((material) => material.kind === "official-test").length;
  const exerciseCount = officialMaterials.filter((material) => material.kind === "exercise").length;
  const { blockNumber, topicNumber } = parseTopicCode(topic.code);

  return {
    code: topic.code || "SIN-CODIGO",
    slug: topic.slug,
    blockNumber,
    topicNumber,
    blockLabel: blockNumber ? `Bloque ${blockNumber}` : "Bloque sin clasificar",
    topicLabel: topicNumber ? `Tema ${topicNumber}` : "Tema sin clasificar",
    title: override?.title ?? topic.title,
    shortTitle: override?.shortTitle ?? topic.title,
    description:
      override?.description ??
      "Tema detectado automáticamente. El PDF ya está disponible en la app y se puede ampliar con tests específicos.",
    pdfPath: topic.pdfPath,
    pdfAssetPath: buildVersionedAssetPath(topic.pdfPath, topic.sourceFilename),
    sourceFilename: topic.sourceFilename,
    podcasts: topic.podcasts ?? [],
    podcastCount: topic.podcasts?.length ?? 0,
    hasPodcasts: (topic.podcasts?.length ?? 0) > 0,
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
})
  .sort((left, right) => {
    const leftBlock = left.blockNumber ?? Number.MAX_SAFE_INTEGER;
    const rightBlock = right.blockNumber ?? Number.MAX_SAFE_INTEGER;

    if (leftBlock !== rightBlock) {
      return leftBlock - rightBlock;
    }

    const leftTopic = left.topicNumber ?? Number.MAX_SAFE_INTEGER;
    const rightTopic = right.topicNumber ?? Number.MAX_SAFE_INTEGER;

    if (leftTopic !== rightTopic) {
      return leftTopic - rightTopic;
    }

    return left.shortTitle.localeCompare(right.shortTitle, "es");
  });

export const topicNavigator = buildTopicNavigator(topics);

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getTopicByCode(code: string) {
  return topics.find((topic) => topic.code === code);
}
