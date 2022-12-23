import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";

import {
  IonModal,
  IonButton,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { useAccountsDispatch } from "../providers/WalletProvider";

import Account from "../models/Account";
import { close } from "ionicons/icons";
import { db } from "../firebase";

interface AccountModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateAccountModal: React.FC<AccountModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const { register, setValue, handleSubmit } = useForm<Account>();
  const modal = useRef<HTMLIonModalElement>(null);

  const dispatch = useAccountsDispatch();
  const [color, setColor] = useState("#aabbcc");

  const createAccount = handleSubmit(async ({ name, type, value }) => {
    const docRef = await addDoc(collection(db, "accounts"), {
      name,
      type,
      value,
      color,
    });
    setShowModal(false);
    modal.current?.dismiss();
    dispatch({
      type: "add-account",
      payload: { id: docRef.id, name, type, value: value },
    });
    console.log("Document written with ID: ", docRef.id);
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
          onClick={() => modal.current?.dismiss()}
          color="ligth"
          slot="start"
        >
          <IonIcon icon={close} />
        </IonButton>
        <IonTitle size="large">Create Account</IonTitle>
        <IonButton slot="end" color="secondary" onClick={createAccount}>
          Create
        </IonButton>
      </IonToolbar>
      <form onSubmit={createAccount}>
        <IonItem>
          <IonLabel position="stacked">Account Name</IonLabel>
          <IonInput
            {...register("name")}
            onIonChange={(e) => setValue("name", e.detail.value!)}
            placeholder="Enter text"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Type</IonLabel>
          <IonSelect
            {...register("type")}
            onIonChange={(e) => setValue("type", e.detail.value!)}
            interface="action-sheet"
            placeholder="Select type"
          >
            <IonSelectOption value="Cash">Cash</IonSelectOption>
            <IonSelectOption value="Credit Card">Credit Card</IonSelectOption>
            <IonSelectOption value="Debit Crad">Debit Crad</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Initial Value</IonLabel>
          <IonInput
            {...register("value")}
            onIonChange={(e) => setValue("value", parseFloat(e.detail.value!))}
            type="number"
            placeholder="Enter text"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Color</IonLabel>
          <div
            className="value"
            style={{
              backgroundColor: color,
              padding: "10px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {color}
          </div>
          <IonToolbar>
            <HexColorPicker
              {...register("color")}
              style={{ marginBottom: "10px" }}
              color={color}
              onChange={setColor}
            />
          </IonToolbar>
        </IonItem>
      </form>
    </IonModal>
  );
};

export default CreateAccountModal;
