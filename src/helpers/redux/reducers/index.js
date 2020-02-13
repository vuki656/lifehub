import { combineReducers } from "redux";

// Reducer imports
import tagsReducer from "./tagsReducer";
import plannerReducer from "./plannerReducer";

const rootReducer = combineReducers({
    tags: tagsReducer,
    planner: plannerReducer
});

export default rootReducer;
