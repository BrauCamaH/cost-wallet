import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonToolbar,
  IonIcon,
} from "@ionic/react";
import { pencilOutline, trashBinOutline } from "ionicons/icons";
import { deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase";
import { useNotesDispatch } from "../providers/NoteProvider";

interface MyCardProps {
  id: string;
  title?: string;
  message?: string;
  onEdit?: () => void;
}

const NoteCard: React.FC<MyCardProps> = ({ id, title, message, onEdit }) => {
  const dispatch = useNotesDispatch();
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>{message}</IonCardContent>
      <IonToolbar>
        <IonButton
          color="danger"
          slot="end"
          onClick={async () => {
            try {
              await deleteDoc(doc(db, "notes", id));
              dispatch({ type: "delete-note", payload: id });
            } catch (error) {}
          }}
        >
          <IonIcon icon={trashBinOutline} />
        </IonButton>
        <IonButton color="secondary" slot="end" onClick={onEdit}>
          <IonIcon icon={pencilOutline} />
        </IonButton>
      </IonToolbar>
    </IonCard>
  );
};

export default NoteCard;
