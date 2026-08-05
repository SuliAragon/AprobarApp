import generatedSimulations from "./generated/simulacros.json";

export interface Simulation {
  slug: string;
  title: string;
  sourceFilename: string;
  assetPath: string;
  description: string;
  studyLabel: string;
  coveredTopicCodes: string[];
}

interface GeneratedSimulation {
  slug: string;
  title: string;
  sourceFilename: string;
  assetPath: string;
}

const simulationOverrides: Record<
  string,
  {
    title?: string;
    description: string;
    studyLabel: string;
    coveredTopicCodes: string[];
  }
> = {
  "simulacro-1": {
    title: "Simulacro 1 · Repaso de los tres primeros temas",
    description:
      "Simulacro global pensado para consolidar los tres primeros temas que ya habéis trabajado antes de seguir escalando el temario.",
    studyLabel: "Repaso acumulado",
    coveredTopicCodes: ["B1T1", "B3T1", "B3T2"],
  },
  "simulacro-2": {
    title: "Simulacro 2 · Repaso de los seis primeros temas",
    description:
      "Simulacro global para consolidar los seis primeros temas trabajados antes de avanzar con nuevo contenido.",
    studyLabel: "Repaso acumulado",
    coveredTopicCodes: ["B1T1", "B1T2", "B1T3", "B2T3", "B2T4", "B2T5"],
  },
  "simulacro-3": {
    title: "Simulacro 3 · Repaso de los nueve primeros temas",
    description:
      "Simulacro global de los nueve temas disponibles para entrenar cambios de bloque y una vuelta completa al temario estudiado.",
    studyLabel: "Repaso acumulado",
    coveredTopicCodes: ["B1T1", "B1T2", "B1T3", "B2T3", "B2T4", "B2T5", "B3T1", "B3T2", "B3T4"],
  },
};

export const simulations: Simulation[] = (generatedSimulations as GeneratedSimulation[])
  .map((simulation) => {
    const override = simulationOverrides[simulation.slug];

    return {
      ...simulation,
      title: override?.title ?? simulation.title,
      description:
        override?.description ??
        "Simulacro global sincronizado desde la carpeta Test/Simulacros para repasar varios temas en una sola sesión.",
      studyLabel: override?.studyLabel ?? "Simulacro global",
      coveredTopicCodes: override?.coveredTopicCodes ?? [],
    };
  })
  .sort((left, right) => left.title.localeCompare(right.title, "es"));
