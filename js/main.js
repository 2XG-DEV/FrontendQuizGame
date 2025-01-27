import { loadData, getTopics, getQuestionsForTopic } from "./data.js";
import {
  mainScreenTemplate,
  questionScreenTemplate,
  resultsScreenTemplate,
} from "./templates.js";
import { createStore } from "./store.js";

const main = document.getElementById("main");

const store = createStore({
  page: "main",
  currentTopic: null,
  currentScore: 0,
  currentQuestion: 0,
  selectedAnswer: null,
  correctAnswer: null,
  submitted: false,
  data: null,
});

store.subscribe((state) => {
  render(state);
  highlightSelectedAnswers(state);
});

function render(state) {
  const { page, data } = state;

  if (!data) {
    // Data hasn't loaded yet
    main.innerHTML = "<p>Loading...</p>";
    return;
  }

  if (page === "main") {
    main.innerHTML = mainScreenTemplate(getTopics(data));
    attachMainScreenListeners();
    return;
  }

  if (page === "question") {
    const questions = getQuestionsForTopic(data, state.currentTopic);
    main.innerHTML = questionScreenTemplate(
      questions[state.currentQuestion],
      state.currentQuestion + 1,
      questions.length
    );
    attachQuestionScreenListeners();
  }

  if (page === "results") {
    main.innerHTML = resultsScreenTemplate(
      state.currentScore,
      getQuestionsForTopic(data, state.currentTopic).length
    );
    attachResultsScreenListeners();
  }
}

function highlightSelectedAnswers(state) {
  const { selectedAnswer, correctAnswer, submitted } = state;
  const questionBtns = document.querySelectorAll("[data-answer]");

  questionBtns.forEach((btn) => {
    // Remove any existing classes
    btn.classList.remove("correct", "incorrect", "selected");

    // If question is submitted, highlight correct/incorrect
    if (submitted) {
      const answer = btn.dataset.answer;
      if (answer === selectedAnswer && answer === correctAnswer) {
        btn.classList.add("correct");
      } else if (answer === selectedAnswer && answer !== correctAnswer) {
        btn.classList.add("incorrect");
      }
      // Disable all choices if submitted
      btn.disabled = true;
    } else {
      // If we haven't submitted, highlight the selected one
      if (btn.dataset.answer === selectedAnswer) {
        btn.classList.add("selected");
      }
      btn.disabled = false;
    }
  });

  // Update submit button text
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) {
    submitBtn.innerHTML = submitted ? "Next Question" : "Submit";
  }
}

function attachMainScreenListeners() {
  const topicBtns = document.querySelectorAll("#topic-btn");
  topicBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Start quiz with the chosen topic
      store.setState({
        page: "question",
        currentTopic: btn.dataset.topic,
        currentScore: 0,
        currentQuestion: 0,
        selectedAnswer: null,
        correctAnswer: null,
        submitted: false,
      });
    });
  });
}

function attachQuestionScreenListeners() {
  const state = store.getState();
  const questions = getQuestionsForTopic(state.data, state.currentTopic);

  // 1) Answer choice buttons
  const questionBtns = document.querySelectorAll("[data-answer]");
  questionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      store.setState({ selectedAnswer: btn.dataset.answer });
    });
  });

  // 2) Submit or Next question button
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const { submitted, currentQuestion, selectedAnswer } = store.getState();

      // If already submitted, go to next question or end quiz
      if (submitted) {
        if (currentQuestion + 1 < questions.length) {
          store.setState({
            currentQuestion: currentQuestion + 1,
            selectedAnswer: null,
            correctAnswer: null,
            submitted: false,
          });
        } else {
          // No more questions, go back to main screen
          store.setState({ page: "results" });
        }
      } else {
        // If not submitted, but user has chosen an answer, check it
        if (selectedAnswer) {
          checkAnswer();
        }
      }
    });
  }
}

function attachResultsScreenListeners() {
  const restartBtn = document.getElementById("restart-btn");
  restartBtn.addEventListener("click", () => {
    store.setState({ page: "main" });
  });
}

function checkAnswer() {
  const state = store.getState();
  const questions = getQuestionsForTopic(state.data, state.currentTopic);
  const { currentQuestion, selectedAnswer, currentScore } = state;
  const correctAnswer = questions[currentQuestion].answer;

  // If correct, increment score
  if (selectedAnswer === correctAnswer) {
    store.setState({ currentScore: currentScore + 1 });
  }

  // We also store the correct answer so the highlight logic can use it
  store.setState({
    submitted: true,
    correctAnswer,
  });
}

loadData().then((data) => {
  // Put data in store, triggering the first render
  store.setState({ data });
});
