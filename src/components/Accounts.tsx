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
import { add, wallet } from "ionicons/icons";

import { formattAsCurrency } from "../utils/currency";
import CreateAccountModal from "./CreateAccountModal";
import Account from "../models/Account";
import { collection, getDocs } from "firebase/firestore";

import {
  useAccountsDispatch,
  useAccountsState,
} from "../providers/WalletProvider";

import { db } from "../firebase";

export default function Accounts() {
  const [showModal, setShowModal] = useState(false);

  const state = useAccountsState();
  const dispatch = useAccountsDispatch();

  useEffect(() => {
    const getAccounts = async () => {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      const documents: Account[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: "set-accounts", payload: documents });
    };
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshLatestRecords]);

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
          <IonIcon icon={add} /> <IonIcon icon={wallet} />
        </IonFabButton>
        <IonItemDivider />
      </IonToolbar>

      {state.accounts.map(({ id, color, value }) => (
        <IonCard
          button
          routerLink={`/page/Wallet/${id}`}
          key={id}
          style={{ maxWidth: "300px", backgroundColor: color }}
        >
          <IonCardHeader>
            <IonCardTitle>{id}</IonCardTitle>
          </IonCardHeader>
          <h1 style={{ marginLeft: "20px", color: "white" }}>
            {formattAsCurrency(value || 0)}
          </h1>
        </IonCard>
      ))}
      <IonItemDivider />
    </>
  );
}
