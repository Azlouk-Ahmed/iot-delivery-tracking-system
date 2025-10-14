import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { axiosPublic } from "@/api/axios";

function AuthCallback() {
    const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        console.error("No token found in callback URL");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axiosPublic.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch({
          type: "LOGIN",
          payload: {
            user: response.data.user,
            accessToken: token,
          },
        });

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error processing callback:", error);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, dispatch, navigate]);
  return (
     <div className="flex items-center justify-center min-h-screen">
      <div>Loading...</div>
    </div>
  )
}

export default AuthCallback
