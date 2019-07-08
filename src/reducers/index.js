import { combineReducers } from "redux";

// Reducer imports
import tagsReducer from "../reducers/reminders/tagsReducer";

const rootReducer = combineReducers({ tagsReducer });

export default rootReducer;
