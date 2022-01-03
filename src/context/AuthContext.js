// tools
import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from "../firebase/config";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(authReducer, {
    user: null,
    authIsReady: false
  });

  // eval auth state on mount
  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(user => {
      dispatch({ type: 'AUTH_IS_READY', payload: user });
      unsub();
    });
  }, []);

  console.log(state);

  return (
    <AuthContext.Provider value={ { ...state, dispatch } }>
      { children }
    </AuthContext.Provider>
  );
};