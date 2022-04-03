import "./css/App.css";
import Headerbar from "./components/Headerbar";
import Router from "./router/Router";
import { useEffect } from "react";
import { refreshAuthToken } from "./api/api";

function App() {
  useEffect(() => {
    const savedRefreshToken = localStorage.getItem("refreshToken")
    const savedRefreshTimestamp = localStorage.getItem("refreshAuthTimestamp")
    if (!savedRefreshToken || !savedRefreshTimestamp) {
      return;
    }
    refreshAuthToken(savedRefreshToken, savedRefreshTimestamp)
  }, [])

  return (
    <div className="App">
      <Headerbar />
      <Router />
    </div>
  );
}

export default App;
