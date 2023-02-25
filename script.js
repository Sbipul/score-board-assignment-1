// select dom elements
const decrementEl = document.getElementById("decrementEl");
const matchContainerEl = document.getElementById("all-matches-el");
const addAnotherMatch = document.getElementById("add-another-match");

// initial state
const initialState = {
  value: [
    {
      id: 1,
      value: 0,
      matchNumber: 1,
    },
  ],
};

// create reducer function
function scoreReducer(state = initialState, action) {
  console.log("action", action);
  if (action.type === "increment") {
    return {
      ...state,
      value: state.value.map((match) =>
        match.id === action.payload.id
          ? { ...match, value: match.value + action.payload.value }
          : match
      ),
    };
  } else if (action.type === "decrement") {
    return {
      ...state,
      value: state.value.map((match) =>
        match.id === action.payload.id
          ? { ...match, value: Math.max(0, match.value - action.payload.value) }
          : match
      ),
    };
  } else if (action.type === "add_match") {
    const newMatch = {
      id: state.value[state.value.length - 1].id + 1,
      value: 0,
      matchNumber: state.value[state.value.length - 1].matchNumber + 1,
    };
    return {
      ...state,
      value: [...state.value, newMatch],
    };
  } else if (action.type === "reset_match") {
    const updateStore = state.value.map((item) => {
      return { ...item, value: 0 };
    });
    return { ...state, value: updateStore };
  } else {
    return state;
  }
}

// create store
const store = Redux.createStore(scoreReducer);

const handleIncrement = (event, id) => {
  event.preventDefault();
  const incrementValue = parseInt(event.target.value);
  store.dispatch({
    type: "increment",
    payload: { id, value: incrementValue },
  });
};

const handleDecrement = (event, id) => {
  event.preventDefault();
  const decrementValue = parseInt(event.target.value);
  store.dispatch({
    type: "decrement",
    payload: { id, value: decrementValue },
  });
};

const handleReset = (event, id) => {
  store.dispatch({
    type: "reset_match",
  });
};

const render = () => {
  const state = store.getState();
  matchContainerEl.innerHTML = ""; // clear the container before appending new elements
  state.value.forEach((element) => {
    matchContainerEl.innerHTML += `
      <div id="matchEl" class="match">
        <div class="wrapper">
          <button class="lws-delete">
            <img src="./image/delete.svg" alt="" />
          </button>
          <h3 class="lws-matchName">Match ${element.matchNumber}</h3>
        </div>
        <div class="inc-dec">
          <form onsubmit="" class="incrementForm">
            <h4>Increment</h4>
            <input
              onchange="handleIncrement(event, ${element.id})"
              type="number"
              name="increment"
              class="lws-increment"
            />
          </form>
          <form class="decrementForm">
                            <h4>Decrement</h4>
                            <input
                            onchange="handleDecrement(event, ${element.id})"
                                type="number"
                                name="decrement"
                                class="lws-decrement"
                            />
                        </form>
                    </div>
                    <div class="numbers">
                        <h2 id="total-score" class="lws-singleResult">${element?.value}</h2>
                    </div>
                </div> `;
  });
};

// update UI initially
render();
const handleSubmit = (event) => {
  event.preventDefault();
};

store.subscribe(render);

addAnotherMatch.addEventListener("click", () => {
  store.dispatch({
    type: "add_match",
  });
});