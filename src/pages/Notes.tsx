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
import {
  IonBadge,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useNotesDispatch, useNotesState } from "../providers/NoteProvider";

import NoteModal from "../components/NoteModal";

import { db } from "../firebase";
import NoteCard from "../components/CardNote";
import Note from "../models/Note";

export default function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const limitOfNotes = 3;

  const [refresh, setRefresh] = useState(0);
  const notesState = useNotesState();

  const dispatch = useNotesDispatch();

  const nPages = Math.ceil(notesState.notesCount / limitOfNotes);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    const getNotes = async () => {
      const q = query(collection(db, "notes"));
      const countSnapshot = await getCountFromServer(q);

      dispatch({ type: "set-notesCount", payload: countSnapshot.data().count });
    };
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      />

      <div style={{ marginBottom: "60px" }}>
        {notesState.notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            message={note.message}
            refresh={() => {
              setRefresh(refresh + 1);
            }}
            goBack={() => {
              previousPage();
            }}
          />
        ))}
      </div>
      <IonFab horizontal="start" vertical="bottom" slot="fixed">
        <IonButton
          disabled={notesState.pageCount === 1}
          onClick={() => {
            previousPage();
          }}
        >
          Back
        </IonButton>
        <IonButton
          disabled={notesState.pageCount === nPages}
          onClick={() => {
            nextPage();
          }}
        >
          Next
        </IonButton>
      </IonFab>
      <IonFab horizontal="center" slot="fixed">
        <IonBadge color="medium">
          {`Notes ${notesState.notesCount} - Page ${notesState.pageCount} / ${nPages}`}
        </IonBadge>
      </IonFab>
      {notesState.pageCount === 1 ? (
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
          <IonFabButton onClick={() => setShowModal(!showModal)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      ) : null}
    </>
  );
}
