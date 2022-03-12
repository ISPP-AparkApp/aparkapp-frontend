import { Suspense } from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import PrimeReact from "primereact/api";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

PrimeReact.ripple = true;

ReactDOM.render(
  <Suspense fallback="Loading">
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
