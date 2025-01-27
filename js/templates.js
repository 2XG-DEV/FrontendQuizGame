function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function mainScreenTemplate(topics) {
  return `
      <div class="main__container">
          <div class="main__title-section">
              <h1 class="main__title">
                  Welcome to the <span class="bold">Frontend Quiz!</span>
              </h1>
              <p class="main__subtitle">Pick a subject to get started.</p>
          </div>
          <div class="selection__list">
             ${topicsTemplate(topics)}
          </div>
      </div>`;
}

function topicsTemplate(topics) {
  if (!topics) return "";
  return topics
    .map((topic) => {
      return `<button id="topic-btn"  data-topic="${topic.title}"  class="selection__item">
                    <div>
                        <img src="${topic.icon}" alt="" />
                    </div>
                    <span class="selection__item__text">
                            ${topic.title}
                    </span>
                </button>`;
    })
    .join("");
}

export function questionScreenTemplate(
  question,
  questionNumber,
  totalQuestions
) {
  const safeQuestion = escapeHtml(question.question); // Escape HTML chars
  return `
    <div class="main__container">
      <div class="question__container">
        <div class="question__header">
          <span class="question__number">
            Question ${questionNumber} of ${totalQuestions}
          </span>
          <h2 class="question__title">${safeQuestion}</h2>
        </div>
        <div class="selection__list">
          ${questionOptionsTemplate(question.options)}
          <button id="submit-btn" class="btn">Submit Answer</button>
        </div>
      </div>
    </div>`;
}

function questionOptionsTemplate(options) {
  return options
    .map((option, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C...
      const safeOption = escapeHtml(option); // Escape HTML chars
      return `
        <button 
          id="question-option-btn" 
          data-answer="${safeOption}" 
          class="selection__item"
        >
          <span class="selection__item__letter">${letter}</span>
          <span class="selection__item__text">${safeOption}</span>
        </button>`;
    })
    .join("");
}

export function resultsScreenTemplate(score, totalQuestions) {
  return `
    <div class="main__container">
      <div class="question__container">
        <h2 class="question__title">Quiz Complete!</h2>
        <p class="question__subtitle">
          You scored ${score} out of ${totalQuestions}.
        </p>
        <button id="restart-btn" class="btn">Restart Quiz</button>
      </div>
    </div>`;
}
