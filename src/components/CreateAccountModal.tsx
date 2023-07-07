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
import { doc, setDoc } from "firebase/firestore";
import {
  useAccountsDispatch,
  useAccountsState,
} from "../providers/WalletProvider";

import Account from "../models/Account";
import { close } from "ionicons/icons";
import { db } from "../firebase";
import { useHistory } from "react-router";

interface AccountModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  account?: Account;
  isEdit?: boolean;
}

const CreateAccountModal: React.FC<AccountModalProps> = ({
  showModal,
  setShowModal,
  account,
  isEdit,
}) => {
  const { register, setValue, handleSubmit } = useForm<Account>({
    defaultValues: {
      id: account ? account.id : "",
      type: account ? account.type : undefined,
      value: account ? account.value : 0,
    },
  });
  const modal = useRef<HTMLIonModalElement>(null);
  const history = useHistory();

  const dispatch = useAccountsDispatch();
  const state = useAccountsState();
  const [color, setColor] = useState(account?.color || "#aabbcc");

  const createAccount = handleSubmit(async ({ id, type, value }) => {
    await setDoc(doc(db, "accounts", id), {
      type,
      value,
      color,
      index: state.accounts.length,
      created: new Date(),
      updated: new Date(),
    });
    setShowModal(false);
    modal.current?.dismiss();

    if (account) {
      history.goBack();
      dispatch({ type: "edit-account", payload: { id, type, value, color } });
    } else {
      dispatch({
        type: "add-account",
        payload: { id, type, value, color },
      });
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
          {account ? "Update Account" : "Create Account"}
        </IonTitle>
        <IonButton
          fill="clear"
          slot="end"
          color="secondary"
          onClick={createAccount}
        >
          {account ? "Edit" : "Create"}
        </IonButton>
      </IonToolbar>
      <form onSubmit={createAccount}>
        <IonItem>
          <IonLabel position="stacked">Account Name</IonLabel>
          <IonInput
            disabled={isEdit}
            {...register("id")}
            onIonChange={(e) => setValue("id", e.detail.value!)}
            placeholder="Enter text"
          />
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
            <IonSelectOption value="Debit Card">Debit Card</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Initial Value</IonLabel>
          <IonInput
            {...register("value")}
            onIonChange={(e) => setValue("value", parseFloat(e.detail.value!))}
            type="number"
            placeholder="Enter Value"
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
