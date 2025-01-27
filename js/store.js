export function createStore(initialState) {
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
