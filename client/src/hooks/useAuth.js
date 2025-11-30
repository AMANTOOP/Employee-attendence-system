import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUserThunk } from "../features/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      dispatch(loadUserThunk());
    }
  }, []);

  return { user, isAuthenticated, loading };
};

export default useAuth;
