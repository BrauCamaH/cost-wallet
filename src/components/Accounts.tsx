import { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItemDivider,
  IonFabButton,
  IonToolbar,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";

import { formattAsCurrency } from "../utils/currency";
import CreateAccountModal from "./CreateAccountModal";
import Account from "../models/Account";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

export default function Accounts() {
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    const getNotes = async () => {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      const documents: Account[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAccounts(documents);
    };
    getNotes();
  }, []);

  return (
    <>
      <CreateAccountModal setShowModal={setShowModal} showModal={showModal} />
      <IonToolbar>
        <h2 style={{ marginTop: "20px", marginLeft: "20px" }}>Accounts</h2>
        <IonFabButton
          style={{ margin: "10px" }}
          slot="end"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <IonIcon icon={add} />
        </IonFabButton>
        <IonItemDivider />
      </IonToolbar>

      {accounts.map(({ name, color, value, initialValue }) => (
        <IonCard style={{ maxWidth: "300px", backgroundColor: color }}>
          <IonCardHeader>
            <IonCardTitle>{name}</IonCardTitle>
          </IonCardHeader>
          <h1 style={{ margin: "20px", color: "white" }}>
            {formattAsCurrency(value || initialValue || 0)}
          </h1>
        </IonCard>
      ))}
    </>
  );
}
