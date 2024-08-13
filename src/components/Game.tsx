/** @jsxImportSource @emotion/react */
import React, { RefObject } from "react";
import StyleSheet from "../helpers/StyleSheet";
import { observer } from "mobx-react-lite";
import { answerServiсe } from "../store/answer";

interface InputArrayProps {
  index: number;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  showNext: () => void;
  answer: { index: number; value: string }[];
}

const Game: React.FC<InputArrayProps> = observer(
  ({ index, inputRefs, showNext, answer }) => {
    const { moviesArray, isVisible, overview, showingOverview, arrayIndex } =
      answerServiсe;

    return (
      <div css={styles.gameContainer}>
        <div css={styles.overviewBar}>
          {isVisible ? overview[index] : showingOverview}
        </div>
        <div css={styles.inputContainer}>
          {moviesArray[index]?.split("").map((e: string, i: number) => (
            <input
              key={i}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              ref={(el) => (inputRefs.current![i] = el)}
              maxLength={1}
              css={[
                styles.stylesInput,
                arrayIndex.includes(i) &&
                  e === " " &&
                  styles.disabledSpaceInput,
              ]}
              disabled={arrayIndex.includes(i)}
              value={answer.find((el) => el.index === i)?.value || ""}
            />
          ))}
        </div>
        <button css={styles.buttonStyle} onClick={showNext}>
          NEXT
        </button>
      </div>
    );
  }
);

const styles = StyleSheet.create({
  overviewBar: { marginTop: -50 },
  gameContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    maxWidth: 1000,
    minWidth: 600,
    alignItems: "center",
    textAlign: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
  },
  stylesInput: {
    textAlign: "center",
    width: "30px",
    minHeight: "40px",
    fontSize: "24px",
    border: "none",
    borderBottom: "1px solid #000",
    outline: "none",
    color: "transparent",
    textShadow: "0 0 0 black",
  },
  disabledSpaceInput: {
    borderBottom: "none",
  },
  buttonStyle: {
    textAlign: "center",
    width: 100,
    minHeight: 60,
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
});

export default Game;
