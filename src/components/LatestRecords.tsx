import { useEffect, useState } from "react";
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
  IonItemDivider,
  IonAccordion,
  IonAccordionGroup,
  AccordionGroupCustomEvent,
  IonHeader,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  const recordType = {
    transfer: "transfer",
    income: "income",
    expense: "expense",
  };

  const recordSeries = [
    { type: recordType.income },
    { type: recordType.expense },
    { type: recordType.transfer },
  ];

  const recordData = (type: string) => {
    return {
      name: type,
      color:
        type === recordType.income
          ? "green"
          : type === recordType.expense
          ? "red"
          : "yellow",
      data: state.latestRecords
        .filter((record) => record.type === type)
        .map(function (record) {
          return {
            value: record.value,
            category: new Date(record.date.toDate()).toDateString(),
          };
        }),
    };
  };

  const series = state.accounts.map(function (acc) {
    return {
      name: acc.id && acc.id,
      color: acc.color,
      data: state.latestRecords
        .filter((record) => record.account === acc.id)
        .map(function (record) {
          return {
            category: new Date(record.date.toDate()).toDateString(),
            value: record.accountValue,
          };
        }),
    };
  });

  useEffect(() => {
    const getRecords = async () => {
      const q = query(
        collection(db, "records"),
        orderBy("date", "asc"),
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
  const [selectedValue, setSelectedValue] = useState();
  const accordionGroupChange = (ev: AccordionGroupCustomEvent) => {
    setSelectedValue(ev.detail.value);
  };

  return (
    <>
      <IonCard style={{ margin: "15px" }}>
        <IonCardHeader>
          <IonTitle>Latest Records</IonTitle>
        </IonCardHeader>
        <IonCardContent>
          {state.latestRecords.map(
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
        <IonItemDivider />
      </IonCard>
      <IonAccordionGroup onIonChange={accordionGroupChange}>
        <IonAccordion style={{ marginBottom: "50px" }} value="first">
          <IonItem slot="header" color="light">
            <IonLabel>Show Graphs</IonLabel>
          </IonItem>
          <div className="ion-padding" slot="content"></div>
        </IonAccordion>
      </IonAccordionGroup>
      {selectedValue === undefined ? null : (
        <>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Records by type over time</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis dataKey="value" />
              <Tooltip />
              <Legend />
              {recordSeries.map((s) => (
                <Line
                  stroke={recordData(s.type).color}
                  dataKey="value"
                  data={recordData(s.type).data}
                  name={recordData(s.type).name}
                  key={recordData(s.type).name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Accounts over time</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis dataKey="value" />
              <Tooltip />
              <Legend />
              {series.map((s) => (
                <Line
                  stroke={s.color}
                  dataKey="value"
                  data={s.data}
                  name={s.name}
                  key={s.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
};

export default LatestRecords;
