import { createContext, useReducer, useContext } from "react";
import Note from "../models/Note";
import Account from "../models/Account";
import Record from "../models/Record";

type Action =
  | { type: "set-accounts"; payload: Account[] }
  | { type: "set-latestRecords"; payload: Record[] }
  | { type: "add-record"; payload: Record }
  | { type: "refresh-latest" }
  | { type: "add-account"; payload: Account }
  | { type: "delete-account"; payload: string }
  | { type: "edit-account"; payload: Account };

type Dispatch = (action: Action) => void;

type State = {
  accounts: Account[];
  refreshLatestRecords: number;
  latestRecords: Record[];
};

type NotesProviderProps = {
  children: React.ReactNode;
};
const initialState: State = {
  accounts: [],
  latestRecords: [],
  refreshLatestRecords: 0,
};

const NotesStateContext = createContext<State>(initialState);
const NotesDispatchContext = createContext<Dispatch | undefined>(undefined);

const notesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-accounts":
      return { ...state, accounts: [...action.payload] };
    case "add-account":
      return { ...state, accounts: [...state.accounts, action.payload] };
    case "add-record":
      return {
        ...state,
        latestRecords: [{ ...action.payload }, ...state.latestRecords],
      };

    case "delete-account":
      return {
        ...state,
        accounts: [
          ...state.accounts.filter((note: Note) => note.id !== action.payload),
        ],
      };

    case "edit-account": {
      const newArray = [...state.accounts];
      const index = newArray.findIndex((item) => item.id === action.payload.id);
      newArray[index] = {
        ...action.payload,
      };

      return { ...state, accounts: [...newArray] };
    }
    case "set-latestRecords":
      return { ...state, latestRecords: action.payload };
    case "refresh-latest":
      return { ...state, refreshLatestRecords: state.refreshLatestRecords + 1 };
  }
};

const WalletProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  return (
    <NotesStateContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
};

const useAccountsState = (): State => {
  const context = useContext(NotesStateContext);
  if (context === undefined) {
    throw new Error("useAccountsState must be used within a Provider");
  }

  return context;
};

const useAccountsDispatch = (): Dispatch => {
  const context = useContext(NotesDispatchContext);
  if (context === undefined) {
    throw new Error("useAccountsState must be used within a Provider");
  }

  return context;
};

export { WalletProvider, useAccountsDispatch, useAccountsState };
