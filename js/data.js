export async function loadData() {
  const dataJson = await fetch("./js/data.json");
  const loadedData = await dataJson.json();
  return loadedData;
}

export function getTopics(data) {
  if (!data) return [];

  const topics = data.quizzes.map((quiz) => {
    return {
      title: quiz.title,
      icon: quiz.icon,
    };
  });

  return topics;
}

export function getQuestionsForTopic(data, topicTitle) {
  if (!data) return [];

  const quiz = data.quizzes.find((quiz) => quiz.title === topicTitle);
  return quiz.questions;
}
