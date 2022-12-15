import { useState, useRef } from "react";

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

import { IonModal, IonInput, IonToolbar } from "@ionic/react";

export default function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  function Modal() {
    const modal = useRef<HTMLIonModalElement>(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel color="secondary">Message :</IonLabel>
        </IonItem>
        <IonTextarea
          autoGrow
          placeholder="Write your note..."
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
        ></IonTextarea>
        <IonFooter>
          <IonToolbar>
            <IonButton slot="end" color="secondary" onClick={() => {}}>
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
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton onClick={() => setShowModal(!showModal)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  );
}
