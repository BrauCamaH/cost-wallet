import { useState, useEffect } from "react";
import {
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { IonButton, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useNotesDispatch, useNotesState } from "../providers/NoteProvider";

import NoteModal from "../components/NoteModal";

import { db } from "../firebase";
import NoteCard from "../components/CardNote";
import Note from "../models/Note";

export default function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [count, setCount] = useState(0);
  const limitOfNotes = 3;

  const notesState = useNotesState();

  const dispatch = useNotesDispatch();

  useEffect(() => {
    const getNotes = async () => {
      const q = query(
        collection(db, "notes"),
        orderBy("createdAt", "desc"),
        limit(limitOfNotes)
      );
      const querySnapshot = await getDocs(q);

      const documents: Note[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "set-notes", payload: documents });
    };
    getNotes();
  }, [dispatch]);

  useEffect(() => {
    const getNotes = async () => {
      const q = query(collection(db, "notes"));
      const countSnapshot = await getCountFromServer(q);

      setCount(countSnapshot.data().count);
      console.log(countSnapshot.data().count);
    };
    getNotes();
  }, []);

  const previousPage = async () => {
    const q = query(
      collection(db, "notes"),
      orderBy("createdAt", "desc"),
      endBefore(notesState.notes[0].createdAt),
      limitToLast(limitOfNotes)
    );
    const querySnapshot = await getDocs(q);
    const documents: Note[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({ type: "set-notes", payload: documents });
    dispatch({ type: "previousPage" });
  };

  const nextPage = async () => {
    let lastKey;
    notesState.notes.forEach((doc) => {
      lastKey = doc.createdAt || "";
    });
    const q = query(
      collection(db, "notes"),
      orderBy("createdAt", "desc"),
      startAfter(lastKey),
      limit(limitOfNotes)
    );
    const querySnapshot = await getDocs(q);
    const documents: Note[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({ type: "set-notes", payload: documents });
    dispatch({ type: "nextPage" });
  };

  return (
    <>
      <NoteModal
        showModal={showModal}
        setShowModal={setShowModal}
        limitOfNotes={limitOfNotes}
        increaseCount={() => {
          setCount(count + 1);
        }}
      />
      <div style={{ marginBottom: "60px" }}>
        {notesState.notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            message={note.message}
            goBack={previousPage}
          />
        ))}
      </div>

      <IonFab horizontal="start" vertical="bottom" slot="fixed">
        <IonButton
          disabled={notesState.pageCount === 0}
          onClick={() => {
            previousPage();
          }}
        >
          Back
        </IonButton>
        <IonButton
          disabled={count <= limitOfNotes * (notesState.pageCount + 1)}
          onClick={() => {
            nextPage();
          }}
        >
          Next
        </IonButton>
      </IonFab>
      {notesState.pageCount === 0 ? (
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
          <IonFabButton onClick={() => setShowModal(!showModal)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      ) : null}
    </>
  );
}
