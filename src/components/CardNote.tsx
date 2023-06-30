import { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonToolbar,
  IonIcon,
  useIonAlert,
  IonTextarea,
} from "@ionic/react";
import { pencilOutline, trashBinOutline } from "ionicons/icons";
import { deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase";
import { useNotesDispatch, useNotesState } from "../providers/NoteProvider";

import NoteModal from "./NoteModal";

import "./CardNote.css";

interface MyCardProps {
  id: string;
  title?: string;
  message?: string;
  goBack: Function;
  refresh: Function;
}

const NoteCard: React.FC<MyCardProps> = ({
  id,
  title,
  message,
  goBack,
  refresh,
}) => {
  const dispatch = useNotesDispatch();
  const notesState = useNotesState();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteAlert] = useIonAlert();
  return (
    <>
      <NoteModal
        showModal={showModal}
        setShowModal={setShowModal}
        noteToEdit={{ id, title, message }}
      />
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {
            <IonTextarea
              disabled
              className="disabled-mss"
              autoGrow
              value={message}
            />
          }
        </IonCardContent>
        <IonToolbar>
          <IonButton
            color="danger"
            slot="end"
            onClick={() => {
              deleteAlert({
                header: "Are you sure?",
                buttons: [
                  { text: "Cancel", role: "cancel" },
                  {
                    text: "Ok",
                    role: "confirm",

                    handler: async () => {
                      try {
                        await deleteDoc(doc(db, "notes", id));
                        dispatch({ type: "decreaseCount" });

                        if (
                          notesState.pageCount !==
                          Math.ceil(notesState.notesCount / 3)
                        ) {
                          refresh();
                        }
                        if (notesState.pageCount !== 0) {
                          if (notesState.notes.length === 1) {
                            goBack();
                          }
                        }

                        dispatch({ type: "delete-note", payload: id });
                      } catch (error) {}
                    },
                  },
                ],
              });
            }}
          >
            <IonIcon icon={trashBinOutline} />
          </IonButton>
          <IonButton
            color="secondary"
            slot="end"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <IonIcon icon={pencilOutline} />
          </IonButton>
        </IonToolbar>
      </IonCard>
    </>
  );
};

export default NoteCard;
