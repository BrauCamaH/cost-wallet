import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useNotesDispatch, useNotesState } from "../providers/NoteProvider";

import NoteModal from "../components/NoteModal";

import { db } from "../firebase";
import NoteCard from "../components/CardNote";
import Note from "../models/Note";

export default function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const notesState = useNotesState();

  const dispatch = useNotesDispatch();

  useEffect(() => {
    const getNotes = async () => {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const documents: Note[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: "set-notes", payload: documents });
    };
    getNotes();
  }, [dispatch]);

  return (
    <>
      <NoteModal showModal={showModal} setShowModal={setShowModal} />
      <div style={{ marginBottom: "60px" }}>
        {notesState.notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            message={note.message}
          />
        ))}
      </div>

      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton onClick={() => setShowModal(!showModal)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  );
}
