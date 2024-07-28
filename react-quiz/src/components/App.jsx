import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

const initState = {
  questions: [],
  // "loading", "ready", "active", "error", "finished"
  status: "loading",
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "DataSuccess":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };
    case "DataFailed":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };
    default:
      throw new Error("Unkown Action");
  }
}

function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initState);

  const numQuestions = questions.length;

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "DataSuccess", payload: data }))
      .catch((err) =>
        dispatch({
          type: "DataFailed",
          payload: "Failed to Load Questions" + err.message,
        }),
      );
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}

export default App;
