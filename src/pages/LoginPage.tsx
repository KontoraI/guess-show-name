/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { authService } from "../store/auth";
import { observer } from "mobx-react-lite";
import StyleSheet from "../helpers/StyleSheet";
import Header from "../components/Header";

const LoginPage = observer(() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = authService;

  const logIn = () => {
    if (username && password) {
      login({ username, password });
    }
  };


  return (
    <>
      <Header />
      <form css={styles.container} onSubmit={logIn}>
        <div css={styles.wrapper}>
          <input
            css={username ? styles.inputFocus : styles.input}
            type="text"
            placeholder="enter the username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            css={password ? styles.inputFocus : styles.input}
            type="password"
            placeholder="enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button css={styles.button} onClick={logIn}>
            Login
          </button>
        </div>
      </form>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "calc(100% - 100px)",
  },
  wrapper: {
    padding: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "30%",
    gap: 20,
    alignItems: "center",
    border: "1px solid #ffdcd1",
    borderRadius: 8,
    backgroundColor: "#252b42",
  },
  button: {
    width: "100%",
    height: 40,
    marginBottom: 15,
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #fff",
    color: "#23a6f0",
    textAlign: "center",
    boxShadow: "wheat 3px 2px 40px",
    transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    ":hover": {
      transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      border: "1px solid #ffdcd1",
      backgroundColor: "#ffdcd1",
      boxShadow: "#1493ee 2px 1px 20px",
      color: "#ffffff",
    },
  },
  input: {
    width: "100%",
    borderRadius: 8,
    padding: 5,
    fontSize: 16,
    border: "1px solid #000",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      color: "transparent",
      textShadow: "0 0 0 black",
    },
  },
  inputFocus: {
    width: "100%",
    borderRadius: 8,
    padding: 5,
    fontSize: 16,
    border: "1px solid #000",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "transparent",
    textShadow: "0 0 0 black",
  },
});

export default LoginPage;
