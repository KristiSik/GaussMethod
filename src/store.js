import { createStore } from "redux";
import gaussApp from "./reducers";

const store = createStore(gaussApp);

export default store;
