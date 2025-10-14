import { axiosPublic } from "@/api/axios";
import { useAuthContext } from "./useAuthContext";
import { useCallback } from "react";

const useRefreshToken = () => {
  const { dispatch } = useAuthContext();

  const refresh = useCallback(async () => {
    const response = await axiosPublic.get("/auth/refresh", {
      withCredentials: true,
    });
    
    dispatch({
      type: "LOGIN",
      payload: {
        user: response.data.user,
        accessToken: response.data.accessToken,
      },
    });
    
    return response.data.accessToken;
  }, [dispatch]);

  return refresh;
};

export default useRefreshToken;