import { css } from "@emotion/react";

type CSSProperties = {
  [key: string]: ReturnType<typeof css>;
};

export default class StyleSheet {
  static create<Styles extends CSSProperties>(styles: Styles): Styles {
    return styles;
  }
}

export const styles = StyleSheet.create({
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,
  name: css`
    margin: 40px 0;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
  `,
  nameWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #252b42;
    width: 100%;
    height: 100px;
  `,
  wrapper: css`
    padding: 30px;
    position: absolute;
    display: flex;
    flex-direction: column;
    margin: 180px 0 0 0;
    justify-content: space-around;
    width: 30%;
    height: fit-content;
    gap: 30px;
    align-items: center;
    right: 35%;
    top: calc(35% - 180px);
    border: 1px solid #ffdcd1;
    border-radius: 10px;
    background-color: #252b42;
  `,
  buttonSuper: css`
    position: relative;
    margin: 40px 0;
    left: 30%;
    width: 60px;
    height: 40px;
  `,
  button: css`
    position: relative;
    left: 30%;
    width: 60px;
    height: 40px;
    margin-bottom: 15px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #fff;
    color: #23a6f0;
    box-shadow: wheat 3px 2px 40px;
    :hover {
      transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      border: 1px solid #ffdcd1;
      background-color: #ffdcd1;
      box-shadow: #1493ee 2px 1px 20px;
      color: #ffffff;
    }
  `,
  input: css`
    border-radius: 8px;
    padding: 5px;
    width: fit-content;
    height: fit-content;
    font-size: 16px;
    border: 1px solid;
  `,
  inputContainer: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
  `,
  stylesInput: css`
    text-align: center;
    width: 25px;
    height: 40px;
    font-size: 24px;
    border: none;
    border-bottom: 1px solid #000;
    outline: none;
    // color: transparent;
    // text-shadow: 0 0 0 black;
  `,
});
