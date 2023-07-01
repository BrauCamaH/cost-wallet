import { useRef } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useNotesDispatch, useNotesState } from "../providers/NoteProvider";
import {
  IonModal,
  IonInput,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { close } from "ionicons/icons";
import Note from "../models/Note";
import { db } from "../firebase";

interface NoteModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  noteToEdit?: Note;
  limitOfNotes?: number;
}

type FormData = {
  title: string;
  message: string;
};

const NoteModal: React.FC<NoteModalProps> = ({
  showModal,
  setShowModal,
  noteToEdit,
  limitOfNotes,
}) => {
  const { register, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: noteToEdit ? noteToEdit.title : "",
      message: noteToEdit ? noteToEdit.message : "",
    },
  });

  const modal = useRef<HTMLIonModalElement>(null);

  const dispatch = useNotesDispatch();
  const notesState = useNotesState();

  const createNote = handleSubmit(async ({ title, message }) => {
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title,
        message,
        createdAt: new Date(),
      });
      setShowModal(false);
      modal.current?.dismiss();

      dispatch({
        type: "add-note",
        payload: { id: docRef.id, title, message },
      });

      dispatch({ type: "increaseCount" });

      if (limitOfNotes) {
        if (notesState.notes.length >= limitOfNotes) {
          dispatch({
            type: "delete-note",
            payload: notesState.notes[limitOfNotes - 1].id,
          });
        }
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  const editNote = handleSubmit(async ({ title, message }) => {
    if (!noteToEdit) return;
    try {
      const noteRef = doc(db, "notes", noteToEdit.id);
      await updateDoc(noteRef, {
        title,
        message,
      });

      dispatch({
        type: "edit-note",
        payload: { id: noteToEdit.id, title, message },
      });
      modal.current?.dismiss();
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <IonModal
      ref={modal}
      isOpen={showModal}
      onDidDismiss={() => {
        setShowModal(false);
      }}
    >
      <IonToolbar>
        <IonButton
          fill="clear"
          onClick={() => modal.current?.dismiss()}
          color="ligth"
          slot="start"
        >
          <IonIcon icon={close} />
        </IonButton>
        <IonTitle size="large">
          {noteToEdit ? "Edit Note" : "Create Note"}
        </IonTitle>
        <IonButton
          fill="clear"
          slot="end"
          color="secondary"
          onClick={noteToEdit ? editNote : createNote}
        >
          {noteToEdit ? "Update" : "Create"}
        </IonButton>
      </IonToolbar>
      <form onSubmit={noteToEdit ? editNote : createNote}>
        <IonItem>
          <IonLabel color="secondary">Title :</IonLabel>
          <IonInput
            {...register("title")}
            placeholder="Title"
            onIonChange={(e) => setValue("title", e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel color="secondary">Message :</IonLabel>
        </IonItem>
        <IonTextarea
          autoGrow
          {...register("message")}
          defaultValue={noteToEdit ? noteToEdit.message : ""}
          placeholder={"Write your note..."}
          onIonChange={(e) => setValue("message", e.detail.value!)}
        />
      </form>
    </IonModal>
  );
};

export default NoteModal;
