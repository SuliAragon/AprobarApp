import test from "node:test";
import assert from "node:assert/strict";

import { withB2T4PracticeClarity } from "../b2t4-practice-clarity.ts";

test("los simulacros de B2T4 aclaran los enunciados que podian inducir a error", () => {
  const createQuestion = (number) =>
    withB2T4PracticeClarity({
      id: `b2t4-test-oficial-ssoo-${number}`,
      section: "demo",
      prompt: "Enunciado original",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" },
      ],
      correctOption: "a",
      explanation: "Demo",
    });

  const iosQuestion = createQuestion(13);
  const unixCommandsQuestion = createQuestion(22);
  const umaskQuestion = createQuestion(41);

  assert.match(iosQuestion?.prompt ?? "", /audio, vídeo, gráficos/i);
  assert.match(unixCommandsQuestion?.prompt ?? "", /\"ls\"/);
  assert.match(umaskQuestion?.prompt ?? "", /modo base 777/i);
});
