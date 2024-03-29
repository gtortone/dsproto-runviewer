import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

ReactDOM.render(
  <RecoilRoot>
    <BrowserRouter basename={process.env.REACT_APP_BASEURL}>
      <App />
    </BrowserRouter>
  </RecoilRoot>,
  document.getElementById("root")
);
