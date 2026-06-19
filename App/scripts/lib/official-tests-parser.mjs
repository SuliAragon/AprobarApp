const optionIds = ["a", "b", "c", "d"];
const officialAnswerOverrides = {
  "b1t1-test-oficial-ce-2:5": "d",
};

const noisePatterns = [
  /^PABLO ARELLANO$/i,
  /^www\.theglobeformacion\.com$/i,
  /^P[aá]gina \d+$/i,
  /^TAI$/i,
  /^[A-Z0-9]+\s+test\d*$/i,
  /^CONSTITUCI[ÓO]N ESPAÑOLA$/i,
  /^ESTRUCTURAS DE DATOS$/i,
  /^PREPARACI[ÓO]N OPOSICIONES$/i,
  /^T[ÉE]CNICOS AUXILIARES DE INFORM[ÁA]TICA$/i,
  /^\d{4}-\d{4}$/i,
  /^Bloque \d+ - Tema \d+$/i,
];

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isNoiseLine(value) {
  return noisePatterns.some((pattern) => pattern.test(value));
}

function extractSolutions(value) {
  const answers = new Map();

  for (const match of value.matchAll(/(\d+)\.\s*([A-D])/g)) {
    const questionNumber = Number.parseInt(match[1], 10);
    const optionIndex = optionIds.indexOf(match[2].toLowerCase());

    if (optionIndex >= 0) {
      answers.set(questionNumber, optionIds[optionIndex]);
    }
  }

  return answers;
}

function splitQuestionBlocks(value) {
  const lines = value
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n")
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .filter((line) => !isNoiseLine(line));

  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    if (/^\d+\.\s+/.test(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join("\n"));
      }

      currentBlock = [line];
      continue;
    }

    if (currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join("\n"));
  }

  return blocks;
}

function extractOptions(block) {
  const markers = [...block.matchAll(/(?:^|\n)([a-d])\)\s*/gm)];

  if (markers.length !== 4) {
    return null;
  }

  const questionNumberMatch = block.match(/^(\d+)\.\s+/);

  if (!questionNumberMatch) {
    return null;
  }

  const questionNumber = Number.parseInt(questionNumberMatch[1], 10);
  const prompt = normalizeWhitespace(block.slice(questionNumberMatch[0].length, markers[0].index));
  const options = markers.map((marker, index) => {
    const start = marker.index + marker[0].length;
    const end = markers[index + 1]?.index ?? block.length;
    return {
      id: optionIds[index],
      label: normalizeWhitespace(block.slice(start, end)),
    };
  });

  return { questionNumber, prompt, options };
}

function buildExplanation(correctOptionId, correctLabel) {
  const suffix = /[.!?…]$/.test(correctLabel) ? "" : ".";
  return `La plantilla oficial marca como correcta la opción ${correctOptionId.toUpperCase()}: ${correctLabel}${suffix}`;
}

function splitQuestionsAndSolutions(source) {
  const solutionsHeadingMatch = source.match(/(?:^|[\n\f])\s*SOLUCIONES\s*(?:[\n\f]|$)/i);

  if (!solutionsHeadingMatch || solutionsHeadingMatch.index === undefined) {
    return [source, ""];
  }

  const headingStart = solutionsHeadingMatch.index;
  const headingEnd = headingStart + solutionsHeadingMatch[0].length;
  return [source.slice(0, headingStart), source.slice(headingEnd)];
}

export function parseOfficialTestText(source, meta) {
  const [questionsSource = "", solutionsSource = ""] = splitQuestionsAndSolutions(source);
  const solutions = extractSolutions(solutionsSource);
  const questions = [];

  for (const block of splitQuestionBlocks(questionsSource)) {
    const parsedBlock = extractOptions(block);

    if (!parsedBlock) {
      continue;
    }

    const overrideKey = `${meta.slug}:${parsedBlock.questionNumber}`;
    const correctOption = officialAnswerOverrides[overrideKey] ?? solutions.get(parsedBlock.questionNumber);

    if (!correctOption) {
      continue;
    }

    const correctLabel = parsedBlock.options.find((option) => option.id === correctOption)?.label ?? "";

    questions.push({
      id: `${meta.slug}-${parsedBlock.questionNumber}`,
      section: "test-oficial",
      prompt: parsedBlock.prompt,
      options: parsedBlock.options,
      correctOption,
      explanation: buildExplanation(correctOption, correctLabel),
    });
  }

  return {
    ...meta,
    questions,
  };
}
