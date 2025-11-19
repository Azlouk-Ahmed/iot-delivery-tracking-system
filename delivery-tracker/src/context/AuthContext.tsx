import type { AuthAction, AuthState } from "@/types/types";
import { createContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react";
import { axiosPublic } from "@/api/axios";

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
      case "LOGIN":
      return { 
        user: action.payload.user, 
        accessToken: action.payload.accessToken,
        isLoading: false
      };
    case "LOGOUT":
      return { user: null, accessToken: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null, 
    accessToken: null,
    isLoading: true 
  });


  useEffect(() => {
    
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await axiosPublic.get("/auth/refresh", {
          withCredentials: true,
        });

        console.log("erjeeeeeeeel :===============",response);

        if (isMounted) {
          dispatch({
            type: "LOGIN",
            payload: {
              user: response.data.user,
              accessToken: response.data.accessToken,
            },
          });
        }
      } catch (error) {
        console.log("No valid refresh token");
        if (isMounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  console.log("authentification state :",state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};