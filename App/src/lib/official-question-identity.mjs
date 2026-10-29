export function prepareOfficialQuestions(questions, topicCode) {
  const reserved = new Set(questions.map((question) => question.id));
  const used = new Set();
  return questions.map((question, index) => {
    let id = question.id;
    // Older PDF extractions can repeat an ID; grading content stays untouched.
    if (used.has(id)) {
      let suffix = index + 1;
      do { id = `${question.id}:occurrence-${suffix++}`; } while (reserved.has(id) || used.has(id));
    }
    used.add(id);
    return { ...question, id, topicCode };
  });
}
