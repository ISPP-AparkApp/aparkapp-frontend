import "./css/App.css";
import Headerbar from "./components/Headerbar";
import Router from "./router/Router";

function App() {
  return (
    <div className="App">
      <Headerbar/>
      <Router />
    </div>
  );
}

export default App;
