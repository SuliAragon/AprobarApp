export const DEFAULT_TOTAL_BLOCKS = 4;

export function parseTopicCode(code) {
  const match = String(code ?? "").match(/^B(\d+)T(\d+)$/i);

  if (!match) {
    return { blockNumber: null, topicNumber: null };
  }

  return {
    blockNumber: Number.parseInt(match[1], 10),
    topicNumber: Number.parseInt(match[2], 10),
  };
}

export function buildTopicNavigator(topics, { totalBlocks = DEFAULT_TOTAL_BLOCKS } = {}) {
  const themeOptionsByBlock = {};

  for (const topic of topics) {
    const { blockNumber, topicNumber } = parseTopicCode(topic.code);

    if (!blockNumber || !topicNumber) {
      continue;
    }

    themeOptionsByBlock[String(blockNumber)] ??= [];
    themeOptionsByBlock[String(blockNumber)].push({
      value: String(topicNumber),
      label: `Tema ${topicNumber} · ${topic.shortTitle}`,
      slug: topic.slug,
      code: topic.code,
    });
  }

  for (const key of Object.keys(themeOptionsByBlock)) {
    themeOptionsByBlock[key].sort((left, right) => Number(left.value) - Number(right.value));
  }

  const blockOptions = Array.from({ length: totalBlocks }, (_, index) => {
    const blockNumber = index + 1;
    const themes = themeOptionsByBlock[String(blockNumber)] ?? [];

    return {
      value: String(blockNumber),
      label: `Bloque ${blockNumber}`,
      loadedTopicCount: themes.length,
    };
  });

  return {
    blockOptions,
    themeOptionsByBlock,
  };
}
