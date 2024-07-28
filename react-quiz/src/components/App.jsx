import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";

const initState = {
  questions: [],
  // "loading", "ready", "active", "error", "finished"
  status: "loading",
  error: null,
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
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
        secondsRemaining: state.questions.length * 1,
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
    case "NextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "FinishQuiz":
      return {
        ...state,
        status: "finished",
        highscore:
          state.highscore > state.points ? state.highscore : state.points,
      };
    case "restart":
      return {
        ...initState,
        status: "ready",
        highscore: state.highscore,
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining <= 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Unkown Action");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0,
  );

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
          <>
            <Progress
              answer={answer}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              numQuestions={numQuestions}
            />
            <Question
              question={questions.at(index)}
              answer={answer}
              dispatch={dispatch}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            dispatch={dispatch}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
