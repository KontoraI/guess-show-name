/** @jsxImportSource @emotion/react */

import { observer } from "mobx-react-lite";
import StyleSheet from "../helpers/StyleSheet";
import { authService } from "../store/auth";
import { keyframes } from "@emotion/react";

const Header = observer(() => {
  const { isAuth, logout } = authService;

  return (
    <div css={styles.navbar}>
      <h1 css={isAuth ? styles.nameIsAuth : styles.name}>GUESS SHOW NAME</h1>
      {isAuth && (
        <button
          css={styles.buttonSuper}
          type="button"
          onClick={() =>
            setTimeout(() => {
              logout();
            }, 500)
          }
        >
          QUIT
        </button>
      )}
    </div>
  );
});
const gradientAnimation = keyframes`
  0% {
    background-position: left center;
  }
  50% {
    background-position: right center;
  }
  100% {
    background-position: left center;
  }
`;

const styles = StyleSheet.create({
  name: {
    position: "relative",
    margin: "40px 0",
    fontSize: "30px",
    color: "#fff",
    fontWeight: 700,
  },
  nameIsAuth: {
    left: 50,
    position: "relative",
    margin: "40px 0",
    fontSize: "30px",
    color: "#fff",
    fontWeight: 700,
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#252b42",
    width: "100%",
    height: 100,
  },
  buttonSuper: {
    position: "relative",
    margin: "40px 0",
    left: "30%",
    width: "100px",
    height: "60px",
    fontWeight: 700,
    fontSize: 18,
    color: "#fff",
    background: "linear-gradient(90deg, #252b42 10%, #414161 49%, #fff 100%)",
    borderRadius: 8,
    backgroundSize: "200% 150%",
    animation: `${gradientAnimation} 3s ease-in-out infinite`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
      transform: "scale(1.1)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
    },
    ":active": {
      transform: "scale(0.95)",
    },
  },
});

export default Header;
