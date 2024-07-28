import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initState = {
  questions: [],
  // "loading", "ready", "active", "error", "finished"
  status: "loading",
  error: null,
  index: 0,
  answer: null,
  points: 0,
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
    case "Start":
      return {
        ...state,
        status: "active",
      };
    case "NewAnswer":
      var Q = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === Q.correctOption
            ? state.points + Q.points
            : state.points,
      };
    default:
      throw new Error("Unkown Action");
  }
}

function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initState,
  );

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
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            question={questions.at(index)}
            answer={answer}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
