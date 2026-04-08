"use client";

import { Provider } from "react-redux";
import store from "../src/store";
import HomePage from "../src/home";

export default function Home() {
  return (
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}