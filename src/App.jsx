import { useEffect, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { setWindowSize } from "./app/features/windowSize/windowSizeSlice";
import { showAlert } from "./app/features/alert/alertSlice";
import { authUserByToken, getAuthToken, logout } from "./utils/auth";
import SharePostModal from "./components/modals/SharePost";
import { AUTH_BY_TOKEN } from "./graphql/auth/queries";
import Toast from "./components/Toast";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Routes from "./Routes";

const App = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();

  const [authByToken, { data, loading }] = useLazyQuery(AUTH_BY_TOKEN);

  const authUser = useCallback(
    data => {
      if (data && data?.authData) {
        const { user, status, message } = data?.authData;

        status && message && dispatch(showAlert({ status, message }));
        status === "error" && dispatch(logout());

        user && dispatch(authUserByToken(user));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    token && authByToken({ variables: { token } });
  }, [token, authByToken]);

  useEffect(() => {
    data && authUser(data);
  }, [data, authUser]);

  useEffect(() => {
    const handleResize = () => dispatch(setWindowSize());

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <Router>
      <Navbar />
      <Toast />

      <Routes />

      <SharePostModal />
    </Router>
  );
};

export default App;
