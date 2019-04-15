import { combineReducers } from "redux";
import dataReducer from "./data";

const gaussApp = combineReducers({
  data: dataReducer
});

export default gaussApp;
