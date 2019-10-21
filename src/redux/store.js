// Object Imports
import thunk from "redux-thunk";

// Destructured Imports
import { createStore, applyMiddleware, compose } from "redux";

// Root Redux Store
import rootReducer from "./reducers/index";

const initialState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        (window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()) ||
            compose
    )
);

export default store;
