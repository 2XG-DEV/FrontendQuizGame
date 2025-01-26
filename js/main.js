import { loadData, getTopics, getQuestionsForTopic } from "./data.js";
import { mainScreenTemplate, questionScreenTemplate } from "./templates.js";

const main = document.getElementById("main");

function createStore(initialState) {
  let state = { ...initialState };
  const subscribers = [];

  function subscribe(fn) {
    subscribers.push(fn);
  }

  function getState() {
    return state;
  }

  function setState(newState) {
    state = { ...state, ...newState };
    subscribers.forEach((fn) => fn(state));
  }

  return { subscribe, getState, setState };
}

// Initialize the immutable store
const store = createStore({
  currentTopic: null,
  currentScore: 0,
  currentQuestion: 0,
  selectedAnswer: null,
  correctAnswer: null,
  submited: false,
});

// Subscribe to highlight selected answers
store.subscribe((state) => {
  const questionBtns = document.querySelectorAll("#question-option-btn");

  questionBtns.forEach((btn) => {
    if (state.submited) {
      if (
        btn.dataset.answer === state.selectedAnswer &&
        btn.dataset.answer === state.correctAnswer
      ) {
        btn.classList.add("correct");
        btn.classList.remove("selected");
      }
      questionBtns.forEach((btn) => {
        btn.disabled = true;
      });
    }

    if (btn.dataset.answer === state.selectedAnswer) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
});

function checkAnswer(questions) {
  const { currentQuestion, selectedAnswer, currentScore } = store.getState();
  const correctAnswer = questions[currentQuestion].answer;

  if (selectedAnswer === correctAnswer) {
    store.setState({ currentScore: currentScore + 1 });
  }

  store.setState({ submited: true });
  console.log(store.getState());
}

export function startQuiz(data, topic) {
  const questions = getQuestionsForTopic(data, topic);

  // Update store instead of local state
  store.setState({
    currentTopic: topic,
    currentScore: 0,
    currentQuestion: 0,
    selectedAnswer: null,
    correctAnswer: questions[0].answer,
    submited: false,
  });

  main.innerHTML = questionScreenTemplate(
    questions[store.getState().currentQuestion],
    store.getState().currentQuestion + 1,
    questions.length
  );

  // Event listeners for question options
  const questionBtns = document.querySelectorAll("#question-option-btn");
  questionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      store.setState({ selectedAnswer: btn.dataset.answer });
    });
  });

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", () => {
    if (store.getState().selectedAnswer) {
      checkAnswer(questions);
    }
  });
}

loadData().then((data) => {
  main.innerHTML = mainScreenTemplate(getTopics(data));

  const topicBtns = document.querySelectorAll("#topic-btn");

  topicBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      startQuiz(data, btn.dataset.topic);
    });
  });
});
