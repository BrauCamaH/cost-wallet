import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../firebase";
import { IonSpinner } from "@ionic/react";

type Action = { type: "set-user"; payload: State } | { type: "sign-out" };
type Dispatch = (action: Action) => void;
type State = { user?: User };
type UserProviderProps = { children: React.ReactNode };

const UserStateContext = createContext<State | undefined>(undefined);
const UserDispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = { user: undefined };

const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-user":
      return { ...state, ...action.payload };

    case "sign-out":
      return { user: undefined };
    default: {
      return { ...state };
    }
  }
};

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const listener = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) dispatch({ type: "set-user", payload: { user } });
        setisLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      listener();
    };
  }, []);

  return isLoading ? (
    <IonSpinner slot="center"/>
  ) : (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

const useUserState = (): State => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return context;
};

const useUserDispatch = (): Dispatch => {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return context;
};

export { UserProvider, useUserState, useUserDispatch };
