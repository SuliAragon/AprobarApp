function labelFromTitle(title) {
  return title.replace(/^Test\s+\d+\s*·\s*/i, "");
}

function uniqueSections(presets) {
  return [...new Set(presets.flatMap((preset) => preset.focusSections))];
}

/**
 * Keeps the five focused tests and adds five broader combinations. The new
 * presets use different seeds later in the test builder, so they also draw a
 * different question order from the same expanded practice bank.
 */
export function buildExtendedPracticePresets(basePresets) {
  if (basePresets.length < 5) {
    return basePresets;
  }

  const focused = basePresets.slice(0, 5);
  const combined = focused.slice(0, 4).map((preset, index) => {
    const nextPreset = focused[index + 1];
    const testNumber = focused.length + index + 1;

    return {
      slug: `ampliado-${index + 1}-${preset.slug}-${nextPreset.slug}`,
      title: `Test ${testNumber} · Repaso ampliado: ${labelFromTitle(preset.title)} y ${labelFromTitle(nextPreset.title)}`,
      description: `Combina ${labelFromTitle(preset.title).toLowerCase()} con ${labelFromTitle(nextPreset.title).toLowerCase()} para practicar cambios de bloque y preguntas transversales.`,
      focusSections: uniqueSections([preset, nextPreset]),
      size: preset.size,
    };
  });
  const allSections = uniqueSections(focused);

  return [
    ...focused,
    ...combined,
    {
      slug: "repaso-global-ampliado",
      title: `Test ${focused.length + 5} · Repaso global ampliado`,
      description: "Recorre todas las partes del tema en una combinación de examen para detectar lagunas antes de pasar al siguiente bloque.",
      focusSections: allSections,
      size: focused[0].size,
    },
  ];
}
