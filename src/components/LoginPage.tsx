import React, { useState } from "react";
import { authService } from "../store/auth";
import { observer } from "mobx-react-lite";

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
    <form onSubmit={logIn}>
      <input
        type="text"
        placeholder="enter the username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="enter the password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onSubmit={logIn}></button>
    </form>
  );
});

export default LoginPage;
