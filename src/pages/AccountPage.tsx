import { useEffect, useState } from "react";
import {
  IonCard,
  IonItem,
  IonCardHeader,
  IonList,
  IonButton,
  IonTitle,
  IonCardContent,
  IonToolbar,
  IonLabel,
  IonIcon,
  IonCardSubtitle,
  IonFab,
  useIonAlert,
} from "@ionic/react";
import {
  batteryCharging,
  boat,
  body,
  cash,
  fastFood,
  footsteps,
  happy,
  home,
  water,
  wifi,
} from "ionicons/icons";
import { formattAsCurrency } from "../utils/currency";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import Record from "../models/Record";

import { db } from "../firebase";
import categories from "../utils/categories";

import { useHistory, useParams } from "react-router";

import CreateAccountModal from "../components/CreateAccountModal";

import { useAccountsState } from "../providers/WalletProvider";

function getCategoryIcon(category?: string): string {
  switch (category) {
    case categories.food:
      return fastFood;
    case categories.internet:
      return wifi;
    case categories.clothes:
      return body;
    case categories.entertaiment:
      return happy;
    case categories.house:
      return home;
    case categories.waterService:
      return water;
    case categories.electricity:
      return batteryCharging;
    case categories.shoes:
      return footsteps;
    case categories.travels:
      return boat;
    default:
      return cash;
  }
}

const AccountPage = () => {
  const [latestRecords, setLatestRecords] = useState<Record[]>([]);
  const [deleteAlert] = useIonAlert();

  const [showModal, setShowModal] = useState(false);

  const state = useAccountsState();

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getRecords = async () => {
      const q = query(
        collection(db, "records"),
        where("account", "==", id),
        limit(10)
      );
      const querySnashot = await getDocs(q);
      const documents: Record[] = querySnashot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(state.accounts);

      setLatestRecords(documents);
    };

    getRecords();
  }, []);

  return (
    <>
      <IonTitle style={{ margin: "15px" }}>{id}</IonTitle>

      <IonCard style={{ margin: "15px" }}>
        <IonCardContent>
          {latestRecords.map(
            ({
              id,
              value,
              category,
              accountToTransfer,
              account,
              type,
              date,
            }) => (
              <IonList key={id}>
                <IonItem detail button>
                  <IonIcon slot="start" icon={getCategoryIcon(category)} />
                  <IonToolbar>
                    <IonLabel>{category}</IonLabel>
                    <IonCardSubtitle>
                      {account +
                        (accountToTransfer ? " => " + accountToTransfer : "")}
                    </IonCardSubtitle>
                  </IonToolbar>
                  <IonItem slot="end">
                    <IonToolbar>
                      <IonLabel
                        color={
                          type === "income"
                            ? "success"
                            : type === "expense"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {formattAsCurrency(value || 0)}
                      </IonLabel>
                      <IonCardSubtitle>
                        {date && new Date(date.toDate()).toLocaleDateString()}
                      </IonCardSubtitle>
                    </IonToolbar>
                  </IonItem>
                </IonItem>
              </IonList>
            )
          )}
        </IonCardContent>
        <IonCardHeader>
          <IonToolbar>
            <IonButton fill="outline" slot="start">
              Show More
            </IonButton>
          </IonToolbar>
        </IonCardHeader>
      </IonCard>
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <CreateAccountModal
          showModal={
            showModal &&
            state.accounts.find((acc) => acc.id === id) !== undefined
          }
          setShowModal={setShowModal}
          account={state.accounts.find((acc) => acc.id === id)}
        />
        <IonButton
          onClick={() => {
            setShowModal(true);
          }}
          fill="outline"
          color="secondary"
        >
          Edit
        </IonButton>
        <IonButton
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
                      await deleteDoc(doc(db, "accounts", id));
                      history.goBack();
                    } catch (error) {}
                  },
                },
              ],
            });
          }}
          fill="outline"
          color="danger"
        >
          Delete
        </IonButton>
      </IonFab>
    </>
  );
};

export default AccountPage;
