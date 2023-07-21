import { createContext, useReducer, useContext } from "react";
import Note from "../models/Note";
import Reminder from "../models/Reminder";

type Action =
  | { type: "set-reminders"; payload: Reminder[] }
  | { type: "add-reminder"; payload: Reminder }
  | { type: "delete-reminder"; payload: string };

type Dispatch = (action: Action) => void;

type State = {
  reminders: Reminder[];
};

type remindersProviderProps = {
  children: React.ReactNode;
};
const initialState: State = {
  reminders: [],
};

const RemindersStateContext = createContext<State>(initialState);
const RemindersDispatchContext = createContext<Dispatch | undefined>(undefined);

const remindersReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-reminders":
      return { ...state, reminders: [...action.payload] };
    case "add-reminder":
      return { ...state, reminders: [action.payload, ...state.reminders] };

    case "delete-reminder":
      return {
        ...state,
        reminders: [
          ...state.reminders.filter((note: Note) => note.id !== action.payload),
        ],
      };
  }
};

const RemindersProvider: React.FC<remindersProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(remindersReducer, initialState);
  return (
    <RemindersStateContext.Provider value={state}>
      <RemindersDispatchContext.Provider value={dispatch}>
        {children}
      </RemindersDispatchContext.Provider>
    </RemindersStateContext.Provider>
  );
};

const useRemindersState = (): State => {
  const context = useContext(RemindersStateContext);
  if (context === undefined) {
    throw new Error("useRemindersState must be used within a Provider");
  }

  return context;
};

const useRemindersDispatch = (): Dispatch => {
  const context = useContext(RemindersDispatchContext);
  if (context === undefined) {
    throw new Error("useRemindersState must be used within a Provider");
  }

  return context;
};

export { RemindersProvider, useRemindersDispatch, useRemindersState };
