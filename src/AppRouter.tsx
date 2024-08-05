import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoute, publicRoute } from "./router";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const isAuth = !!localStorage.getItem("user");

  return (
    <>
      {isAuth ? (
        <Routes>
          <Route
            path={privateRoute.path}
            element={<privateRoute.element />}
            key={privateRoute.path}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path={publicRoute.path}
            element={<publicRoute.element />}
            key={publicRoute.path}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
});

export default AppRouter;
