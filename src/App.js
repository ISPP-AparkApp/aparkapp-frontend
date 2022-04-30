import "./css/App.css";
import Headerbar from "./components/Headerbar";
import Router from "./router/Router";
import { useEffect, useState } from "react";
import { refreshAuthToken } from "./api/api";
import { ProgressSpinner } from 'primereact/progressspinner';

function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false)
  useEffect(() => {
    const savedRefreshToken = localStorage.getItem("refreshToken")
    const savedRefreshTimestamp = localStorage.getItem("refreshAuthTimestamp")
    if (!savedRefreshToken || !savedRefreshTimestamp) {
      return setAppIsLoaded(true);
    }
    refreshAuthToken(savedRefreshToken, savedRefreshTimestamp).then(() => {
      setAppIsLoaded(true)
    })
  }, [])

  return appIsLoaded
    ? (
      <div className="App">
        <Headerbar />
        <Router />
      </div>
    )
    : (
      <ProgressSpinner className="loadingApp" />
    )
}

export default App;