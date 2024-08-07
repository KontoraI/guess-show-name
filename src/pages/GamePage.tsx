/** @jsxImportSource @emotion/react */
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { fetchMovies } from "../services/movieList";
import { css } from "@emotion/react";
import { authService } from "../store/auth";
import { styles } from ".";

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
  const [correctAnswers, setCorrectAnsers] = useState(0);
  const firstDisabledIndex = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("correctAnswers", correctAnswers.toString());
      const fetchedMovies = await fetchMovies();

      for (let item of fetchedMovies) {
        setMoviesArray((prev) => [...prev, item.original_title]);
        setOverview((prev) => [...prev, item.overview]);
      }

      setShowingOverview(
        overview[index]?.slice(
          0,
          !overview[index][
            overview[index].indexOf(
              " ",
              Math.floor(overview[index].length / 2)
            ) - 1
          ].match(/[a-zA-Z]/)
            ? overview[index].indexOf(
                " ",
                Math.floor(overview[index].length / 2)
              ) - 1
            : overview[index].indexOf(
                " ",
                Math.floor(overview[index].length / 2)
              )
        ) + "..."
      );

      const movie = moviesArray[index];

      let counter = 0;
      const indexes: number[] = [];
      for (let i = 0; i < movie?.split("").length; i++) {
        const letter = movie?.split("")[i];

        if (!letter.match(/[a-zA-Z]/) && !indexes.includes(i)) {
          indexes.push(i);
        }

        if (counter < Math.floor(movie?.split("").length / 2)) {
          const randomIndex = Math.floor(Math.random() * movie?.length);

          indexes.push(randomIndex);
          counter++;
        }
      }
      const indexesOnly = Array.from(new Set(indexes.sort((a, b) => a - b)));

      setArrayIndex(indexesOnly);

      for (let index of indexesOnly) {
        setAnswer((prev) => [...prev, { index: index, value: movie[index] }]);
        if (firstDisabledIndex.current === index) {
          firstDisabledIndex.current++;
        }
      }

      inputRefs.current[firstDisabledIndex.current]?.focus();

      setMoviesLoaded(true);
    };
    fetchData();
  }, [moviesLoaded, index, lives]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = document.activeElement as HTMLInputElement;
      const currentIndex = inputRefs.current?.indexOf(target);

      if (event.key === "Enter") {
        if (lives) {
          showNext();
        }
      }

      if (event.key.match(/[a-zA-Z]/) && event.key.length === 1) {
        let nextIndex = currentIndex + 1;

        if (answer.length !== moviesArray[index]!.length) {
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
        if (currentIndex !== firstDisabledIndex.current) {
          setAnswer((prev) => [...prev.slice(0, -1)]);

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

  console.log(answer);

  const restart = () => {
    setArrayIndex([]);
    setAnswer([]);
    firstDisabledIndex.current = 0;
    setLives(3);
    setIndex(0);
    setCorrectAnsers(0);
  };

  const hint = () => {
    setIsVisible((prev) => !prev);
  };

  const logOut = () => {
    localStorage.removeItem("correctAnswers");
    localStorage.removeItem("user");
    authService.setIsAuth();
  };

  const showNext = () => {
    const newAnswer = answer
      .sort((firstObj, secondObj) => firstObj.index - secondObj.index)
      .map((e) => e.value)
      .join("");

    if (newAnswer.toLowerCase() === moviesArray[index].toLowerCase()) {
      setIndex((prev) => prev + 1);
      setCorrectAnsers((prev) => prev + 1);
      localStorage.setItem("correctAnswers", correctAnswers.toString());
      setArrayIndex([]);
      setAnswer([]);
      firstDisabledIndex.current = 0;
    } else {
      setLives((lives) => lives - 1);
    }
    setArrayIndex([]);
    setAnswer([]);
    firstDisabledIndex.current = 0;
  };

  return (
    <div css={styles.container}>
      <div css={styles.nameWrapper}>
        <h1 css={styles.name}>GUESS SHOW NAME</h1>
        <button css={styles.buttonSuper} type="button" onClick={logOut}>
          QUIT
        </button>
      </div>

      <div>{lives}</div>
      <button onClick={hint}>Hints</button>
      <div>
        {lives ? (
          <>
            {isVisible ? overview[index] : showingOverview}
            <div css={styles.inputContainer}>
              {moviesArray[index]?.split("").map((e: string, i: number) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  maxLength={1}
                  css={styles.stylesInput}
                  disabled={arrayIndex.includes(i)}
                  value={answer.find((el) => el.index === i)?.value ?? ""}
                />
              ))}
            </div>
            <button onClick={showNext}>NEXT</button>
          </>
        ) : (
          <div>
            <button onClick={restart}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
});

export default GamePage;
