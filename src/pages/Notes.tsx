import { useState, useRef, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import { add, close } from "ionicons/icons";
import { useNotesDispatch, useNotesState } from "../providers/NoteProvider";

import { IonModal, IonInput, IonToolbar } from "@ionic/react";
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
  }, []);

  function Modal() {
    const modal = useRef<HTMLIonModalElement>(null);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    async function createNote() {
      try {
        const docRef = await addDoc(collection(db, "notes"), {
          title,
          message,
        });
        setShowModal(false);
        modal.current?.dismiss();

        dispatch({
          type: "add-note",
          payload: { id: docRef.id, title, message },
        });

        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    return (
      <IonModal
        ref={modal}
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
      >
        <IonToolbar>
          <IonTitle size="large">Create Note</IonTitle>
          <IonButton
            onClick={() => modal.current?.dismiss()}
            color="ligth"
            slot="end"
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
        <IonItem>
          <IonLabel color="secondary">Title :</IonLabel>
          <IonInput
            placeholder="Title"
            value={title}
            onIonChange={(e) => setTitle(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel color="secondary">Message :</IonLabel>
        </IonItem>
        <IonTextarea
          autoGrow
          placeholder="Write your note..."
          value={message}
          onIonChange={(e) => setMessage(e.detail.value!)}
        ></IonTextarea>
        <IonFooter>
          <IonToolbar>
            <IonButton slot="end" color="secondary" onClick={createNote}>
              Create
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    );
  }
  return (
    <>
      <Modal />
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
