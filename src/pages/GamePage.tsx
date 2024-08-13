/** @jsxImportSource @emotion/react */
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import StyleSheet from "../helpers/StyleSheet";
import { answerServiсe } from "../store/answer";
import Header from "../components/Header";
import Game from "../components/Game";

const GamePage = observer(() => {
  const { hint, moviesArray, loadMovie, fetchData } = answerServiсe;
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [answer, setAnswer] = useState<{ index: number; value: string }[]>([]);
  const [moviesLoaded, setMoviesLoaded] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const firstEnabledIndex = useRef<number>(0);

  useEffect(() => {
    const finalLoad = async () => {
      setMoviesLoaded(await fetchData());
    };
    finalLoad();
  }, []);

  useEffect(() => {
    const { indexEnable, answerArray } = loadMovie(moviesLoaded, index);
    setAnswer(answerArray);
    firstEnabledIndex.current = indexEnable;
    inputRefs.current[indexEnable]?.focus();
  }, [moviesLoaded, lives, index]);

  useEffect(() => {
    const inputFocus = () => {
      if (
        !inputRefs.current.includes(document.activeElement as HTMLInputElement)
      ) {
        setTimeout(() => {
          for (let i = 0; i < inputRefs.current!.length; i++) {
            if (!inputRefs.current![i]?.value) {
              inputRefs.current![i]?.focus();
              break;
            }
          }
        }, 0);
      }
    };

    document.addEventListener("focusout", inputFocus);

    return () => {
      document.removeEventListener("focusout", inputFocus);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = document.activeElement as HTMLInputElement;
      const currentIndex = inputRefs.current?.indexOf(target);

      if (event.key === "Enter") {
        if (lives) {
          showNext();
        }
      }
      if (event.key === "Tab") {
        event.preventDefault();
      }

      if (event.key.match(/[a-zA-Z]/) && event.key.length === 1) {
        let nextIndex = currentIndex + 1;
        if (currentIndex >= 0) {
          if (answer?.length !== moviesArray[index]?.length) {
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
            inputRefs.current[nextIndex]?.focus();
          }
        } else {
          inputRefs.current[inputRefs.current?.length - 1]?.focus();
          event.preventDefault();
        }
      } else if (event.key === "Backspace") {
        let prevIndex = currentIndex - 1;
        if (currentIndex !== firstEnabledIndex.current) {
          if (answer?.length > moviesArray[index]?.length / 2) {
            setAnswer((prev) => [...prev.slice(0, -1)]);
          }
          if (inputRefs.current[prevIndex]?.disabled) {
            while (inputRefs.current[prevIndex]?.disabled) {
              prevIndex--;
            }
          }
          inputRefs.current[prevIndex]?.focus();
        } else {
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

  useEffect(() => {
    if (moviesLoaded) {
      if (answer?.length === moviesArray[index]?.length) {
        showNext();
      }
    }
  }, [answer]);

  const restart = () => {
    setAnswer([]);
    firstEnabledIndex.current = 0;
    setLives(3);
    setIndex(0);
    answerServiсe.isVisible = false;
    localStorage.setItem("correctAnswers", JSON.stringify(0));
  };

  const showNext = () => {
    const newAnswer = answer
      .sort((firstObj, secondObj) => firstObj.index - secondObj.index)
      .map((e) => e.value)
      .join("");

    if (newAnswer.toLowerCase() === moviesArray[index].toLowerCase()) {
      setIndex((prev) => prev + 1);
      localStorage.setItem(
        "correctAnswers",
        JSON.stringify(JSON.parse(localStorage.getItem("correctAnswers")!) + 1)
      );
    } else {
      setLives((live) => live - 1);
    }
    answerServiсe.isVisible = false;
    answerServiсe.arrayIndex = [];
    setAnswer([]);
    firstEnabledIndex.current = 0;
  };

  return (
    <div css={styles.container}>
      <Header />
      <div css={styles.pageContainer}>
        <div css={styles.navMenu}>
          <div css={styles.livesBar}>
            {lives} lives ({localStorage.getItem("correctAnswers")}/20 answers
            correct)
          </div>
          {lives !== 0 && (
            <button css={styles.buttonGame} onClick={() => hint(inputRefs)}>
              HINTS
            </button>
          )}
        </div>
        <div css={styles.gameMenu}>
          {lives && index < 20 ? (
            <Game
              answer={answer}
              index={index}
              inputRefs={inputRefs}
              showNext={showNext}
            />
          ) : (
            <button css={styles.buttonGame} onClick={restart}>
              RESTART
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 100px)",
    justifyContent: "space-between",
    padding: "100px 0",
    fontSize: 18,
    fontWeight: 700,
  },
  navMenu: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
    alignItems: "center",
  },
  livesBar: {
    display: "block",
    textAlign: "center",
    alignItems: "center",
    height: 20,
    minWidth: 200,
    fontWeight: 700,
    fontSize: 18,
  },
  buttonGame: {
    textAlign: "center",
    width: 100,
    height: 60,
    fontWeight: 700,
    backgroundColor: "#252b42",
    color: "#fff",
    border: "1px solid #aac9e9",
    borderRadius: 8,
    transition: "border, border-radius 0.3s",
    ":hover": {
      border: "1px solid #828282",
      transition: "border, border-radius 0.3s ease-in-out",
      borderRadius: 12,
    },
  },
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  gameMenu: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    height: "60%",
    gap: 40,
    fontWeight: 500,
  },
});

export default GamePage;
