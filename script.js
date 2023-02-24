// generate variable function 
const generateVariable = (id) =>{
    return document.getElementById(id);
}

// dom elements 
const matchContainer = generateVariable('matchContainer')
const newMatchBtn = generateVariable('newMatchBtn')
const valueEl = generateVariable('value')
const resetBtn = generateVariable('reset')
const incrementValues = document.querySelectorAll('.lws-increment')
// action types 
const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const RESET = 'reset';
const ENTER = 'Enter'
const KEYPRESS = 'keypress'
const ADD_NEW_MATCH = 'newmatch'
const REMOVE_MATCH = 'removematch'

// action and payload generator 
const fireAction = (type,payload)=>{
    return {type,payload}
}

// initialState here 
const initialState = {
    matches:[
        {
            id:1,
            value:0
        }
    ]
}


// reducer here 
function scoreBoardReducer(state=initialState,action){
    if (action.type===ADD_NEW_MATCH) {
        const items = state.matches.length;
        return {
            ...state,
            matches:[...state.matches,{id:items+action.payload,value:0}]
        }
    }else if(action.type===REMOVE_MATCH){
        if (state.matches.length<=1) {
            return
        } else {
            const filteredMatch = state.matches.filter(match=> match.id !== action.payload)
            return {
                ...state,
                matches:filteredMatch
            }
        }
        
    }else if(action.type===INCREMENT){
        console.log(action.payload.value,action.payload.id)
        const filtered = state.matches.filter(match=> match.id !== +action.payload.id)
        let selected = state.matches.find(match=> match.id === +action.payload.id)
        selected.value = action.payload.value
        const newArr = [...filtered,selected]
        // console.log(newArr)
        return {
            ...state,
            matches:newArr
        }
    } else{
        return state
    }
}

// store 
const store = Redux.createStore(scoreBoardReducer)

// render function 
const render = ()=>{
    const state = store.getState();
    state.matches && (matchContainer.innerHTML = state.matches.map((match)=>`<div class="match">
    <div class="wrapper">
        <button onclick="removeMatch(${match.id})" class="lws-delete">
            <img src="./image/delete.svg" alt="" />
        </button>
        <h3 class="lws-matchName">Match ${match.id}</h3>
    </div>
    <div class="inc-dec">
        <form class="incrementForm">
            <h4>Increment</h4>
            <input
                data-target=${match.id}
                type="number"
                name="increment"
                class="lws-increment"
            />
        </form>
        <form class="decrementForm">
            <h4>Decrement</h4>
            <input
                type="number"
                name="decrement"
                class="lws-decrement"
            />
        </form>
    </div>
    <div class="numbers">
        <h2 id="value${match.id}" class="lws-singleResult">${match.value}</h2>
    </div>
</div>`))
}
// render()

// subscribed data from store with render function 
store.subscribe(render)

// events

for (let i = 0; i < incrementValues.length; i++) {
    const element = incrementValues[i];
    let id = element.getAttribute('data-target')
    element.addEventListener('keypress', (e)=>{
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log(e.target.value)
            store.dispatch({type:INCREMENT,payload:{id:id,value:e.target.value}})
            
        }
    })
}
const removeMatch = (id)=>{
    store.dispatch(fireAction(REMOVE_MATCH,id))
}
newMatchBtn.addEventListener('click',()=>{
    store.dispatch(fireAction(ADD_NEW_MATCH,1))
})
// resetBtn.addEventListener('click',()=>{
//     store.dispatch(fireAction(RESET,0))
// })





