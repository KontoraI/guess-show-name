/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { authService } from "../store/auth";
import { observer } from "mobx-react-lite";
import { styles } from "./index";

const LoginPage = observer(() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logIn = () => {
    if (username && password) {
      localStorage.setItem("user", JSON.stringify({ username, password }));
      authService.setIsAuth();
    }
  };

  return (
    <form css={styles.container} onSubmit={logIn}>
      <div css={styles.nameWrapper}>
        <h1 css={styles.name}>GUESS-SHOW-NAME</h1>
      </div>
      <div css={styles.wrapper}>
        <input
          css={styles.input}
          type="text"
          placeholder="enter the username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          css={styles.input}
          type="password"
          placeholder="enter the password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button css={styles.button} onSubmit={logIn}>
          LogIn
        </button>
      </div>
    </form>
  );
});

export default LoginPage;
