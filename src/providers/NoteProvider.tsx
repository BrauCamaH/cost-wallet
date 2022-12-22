import { createContext, useReducer, useContext } from "react";
import Note from "../models/Note";

type Action =
  | { type: "set-notes"; payload: Note[] }
  | { type: "add-note"; payload: Note }
  | { type: "delete-note"; payload: string }
  | { type: "edit-note"; payload: Note };

type Dispatch = (action: Action) => void;

type State = {
  notes: Note[];
};

type NotesProviderProps = {
  children: React.ReactNode;
};
const initialState: State = {
  notes: [],
};

const NotesStateContext = createContext<State>(initialState);
const NotesDispatchContext = createContext<Dispatch | undefined>(undefined);

const notesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-notes":
      return { notes: [...action.payload] };
    case "add-note":
      return { ...state, notes: [...state.notes, action.payload] };

    case "delete-note":
      return {
        ...state,
        notes: [
          ...state.notes.filter((note: Note) => note.id !== action.payload),
        ],
      };

    case "edit-note": {
      const newArray = [...state.notes];
      const index = newArray.findIndex((item) => item.id === action.payload.id);
      newArray[index] = {
        ...action.payload,
      };

      return { ...state, notes: [...newArray] };
    }
  }
};

const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  return (
    <NotesStateContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
};

const useNotesState = (): State => {
  const context = useContext(NotesStateContext);
  if (context === undefined) {
    throw new Error("useNotesState must be used within a Provider");
  }

  return context;
};

const useNotesDispatch = (): Dispatch => {
  const context = useContext(NotesDispatchContext);
  if (context === undefined) {
    throw new Error("useNotesState must be used within a Provider");
  }

  return context;
};

export { NotesProvider, useNotesDispatch, useNotesState };
