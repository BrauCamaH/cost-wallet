import { useEffect } from "react";
import {
  IonCard,
  IonItem,
  IonCardHeader,
  IonList,
  IonTitle,
  IonCardContent,
  IonToolbar,
  IonLabel,
  IonIcon,
  IonCardSubtitle,
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
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import Record from "../models/Record";

import { db } from "../firebase";
import categories from "../utils/categories";
import {
  useAccountsDispatch,
  useAccountsState,
} from "../providers/WalletProvider";

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

const LatestRecords = () => {
  const state = useAccountsState();
  const dispatch = useAccountsDispatch();

  useEffect(() => {
    const getRecords = async () => {
      const q = query(
        collection(db, "records"),
        orderBy("date", "desc"),
        limit(10)
      );
      const querySnashot = await getDocs(q);
      const documents: Record[] = querySnashot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: "set-latestRecords", payload: documents });
    };

    getRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshLatestRecords]);

  return (
    <IonCard style={{ margin: "15px" }}>
      <IonCardHeader>
        <IonTitle>Latest Records</IonTitle>
      </IonCardHeader>
      <IonCardContent>
        {state.latestRecords.map(
          ({ id, value, category, accountToTransfer, account, type, date }) => (
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
    </IonCard>
  );
};

export default LatestRecords;
