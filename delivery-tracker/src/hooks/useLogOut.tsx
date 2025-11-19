// hooks/useLogout.ts
import { axiosPrivate } from "@/api/axios";
import { useAuthContext } from "./useAuthContext";
import { useCallback } from "react";

const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = useCallback(async () => {
    try {
      console.log("Logging out...");
      await axiosPrivate.post("/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, [dispatch]);

  return { logout };
};

export default useLogout;