/** @jsxImportSource @emotion/react */
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { fetchMovies } from "../services/movieList";
import { css } from "@emotion/react";
import { authService } from "../store/auth";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";

const GamePage = observer(() => {
  const [lives, setLives] = useState(3);
  const [moviesLoaded, setMoviesLoaded] = useState(false);
  const [moviesArray, setMoviesArray] = useState<string[]>([]);
  const [overview, setOverview] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<{ index: number; value: string }[]>([]);
  const [arrayIndex, setArrayIndex] = useState<number[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showingOverview, setShowingOverview] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const navigator = useNavigate();
  const [correctAnswers, setCorrectAnsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("correctAnswers", correctAnswers.toString());
      const movies = (await fetchMovies()).map((e) => e.original_title);
      const describing = (await fetchMovies()).map((e) => e.overview);
      setMoviesArray(movies);
      setOverview(describing);

      setShowingOverview(
        overview[index]?.slice(
          0,
          !overview[index][
            overview[index].indexOf(" ", overview[index].length / 2) - 1
          ].match(/[a-zA-Z]/)
            ? overview[index].indexOf(" ", overview[index].length / 2) - 1
            : overview[index].indexOf(" ", overview[index].length / 2)
        ) + "..."
      );

      const movie = moviesArray[index];

      for (let i = 0; i < movie?.split("").length; i++) {
        let letter = movie?.split("")[i];
        if (!letter.match(/[a-zA-Z]/) && !arrayIndex.includes(i)) {
          setArrayIndex((prev) => [...prev, i]);
          setAnswer((prev) => [...prev, { index: i, value: movie[i] }]);
        }
      }


      
      let indexId = 0;
      if (inputRefs.current[indexId]?.disabled) {
        while (inputRefs.current[indexId]?.disabled) {
          indexId++;
        }
      }

      inputRefs.current[indexId]?.focus();
      setMoviesLoaded(true);
    };
    fetchData();
  }, [moviesLoaded, index]);

  console.log(answer);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = document.activeElement as HTMLInputElement;
      const currentIndex = inputRefs.current?.indexOf(target);

      if (event.key === "Enter") {
        showNext();
        return;
      }

      if (event.key.match(/[a-zA-Z]/) && event.key.length === 1) {
        let nextIndex = currentIndex + 1;

        if (answer.length !== inputRefs.current?.length) {
          if (inputRefs.current[currentIndex]?.value) {
            if (inputRefs.current[nextIndex]?.disabled) {
              while (inputRefs.current[nextIndex]?.disabled) {
                nextIndex++;
              }
            }

            inputRefs.current[nextIndex]?.focus();
            setAnswer((prev) => [
              ...prev,
              { index: nextIndex, value: event.key },
            ]);
            return;
          } else {
            setAnswer((prev) => [
              ...prev,
              { index: currentIndex, value: event.key },
            ]);

            if (inputRefs.current[nextIndex]?.disabled) {
              while (inputRefs.current[nextIndex]?.disabled) {
                nextIndex++;
              }
            }

            inputRefs.current[nextIndex]?.focus();
            return;
          }
        } else {
          inputRefs.current[inputRefs.current?.length - 1]?.focus();
          event.preventDefault();
        }
      } else if (event.key === "Backspace") {
        let prevIndex = currentIndex - 1;
        if (currentIndex !== 0) {
          setAnswer((prev) => [...prev.slice(0, -1)]);

          if (inputRefs.current[prevIndex]?.disabled) {
            while (inputRefs.current[prevIndex]?.disabled) {
              prevIndex--;
            }
          }
          inputRefs.current[prevIndex]?.focus();
        } else {
          setAnswer((prev) => [prev[0]]);
          inputRefs.current[0]?.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [answer, inputRefs.current]);

  const hint = () => {
    setIsVisible((prev) => !prev);
  };

  const logOut = () => {
    localStorage.removeItem("correctAnswers");
    localStorage.removeItem("user");
    authService.setIsAuth();
  };

  const showNext = () => {
    const newAnswer = answer.sort(
      (firstObj, secondObj) => firstObj.index - secondObj.index
    );
    const letters = newAnswer.reduce((acc, curr) => {
      if (curr.value) {
        acc += curr.value;
      }
      return acc;
    }, "");

    if (letters.toLowerCase() === moviesArray[index].toLowerCase()) {
      setIndex((prev) => prev + 1);
      setMoviesLoaded(false);
      setAnswer([]);
      setArrayIndex([]);
      inputRefs.current = [];
      setCorrectAnsers((prev) => prev + 1);
      localStorage.setItem("correctAnswers", correctAnswers.toString());
    } else {
      setAnswer([]);
      setLives((lives) => lives - 1);
    }
  };

  return (
    <div>
      <h6>GUESS SHOW NAME</h6>
      <form onSubmit={logOut}>
        <button
          css={css`
            background: linear-gradient(45deg, gold, blue, white);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 18px;
            font-weight: bold;
            padding: 10px 20px;
            text-transform: uppercase;
            transition: transform 0.2s, box-shadow 0.2s;

            &:hover {
              transform: scale(1.1);
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }

            &:active {
              transform: scale(0.9);
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
          `}
          type="button"
          onClick={logOut}
        >
          QUIT
        </button>
      </form>
      <div>{lives}</div>
      <button onClick={hint}>Hints</button>
      <div>
        {lives ? (
          <>
            {isVisible ? overview[index] : showingOverview}
            <div
              css={css`
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 4px;
              `}
            >
              {moviesArray[index]?.split("").map((e: string, i: number) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  maxLength={1}
                  css={css`
                    text-align: center;
                    width: 25px;
                    height: 40px;
                    font-size: 24px;
                    border: none;
                    border-bottom: 1px solid #000;
                    outline: none;
                    color: transparent;
                    text-shadow: 0 0 0 black;
                  `}
                  disabled={arrayIndex.includes(i)}
                  value={answer.find((el) => el.index === i)?.value ?? ""}
                  placeholder={arrayIndex.includes(i) ? e : ""}
                />
              ))}
            </div>
            <button onClick={showNext}>NEXT</button>
          </>
        ) : (
          <div>
            <button
              onClick={() => {
                localStorage.removeItem("wrongAnswewers");
                localStorage.removeItem("correctAnswers");
                setLives(3);
                setIndex(0);
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default GamePage;
