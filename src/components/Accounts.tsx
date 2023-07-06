import { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItemDivider,
  IonFabButton,
  IonToolbar,
  IonIcon,
  IonFab,
  IonButton,
} from "@ionic/react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { add, wallet, pieChart, close } from "ionicons/icons";

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

  const pieData = state.accounts.map(function (acc) {
    return { name: acc.id, value: acc.value };
  });

  const COLORS = state.accounts.map((acc) => acc.color);

  const RADIAN = Math.PI / 180;
  const [showPieChart, setShowPieChart] = useState(false);

  const renderCustomizedLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <>
      <CreateAccountModal setShowModal={setShowModal} showModal={showModal} />
      <IonFab horizontal="end" vertical="top" slot="fixed">
        {showPieChart && (
          <>
            <IonButton
              onClick={() => {
                setShowPieChart(false);
              }}
            >
              <IonIcon icon={close} />
            </IonButton>
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </IonFab>
      <IonToolbar>
        <h2 style={{ marginTop: "20px", marginLeft: "20px" }}>Accounts</h2>
        <IonFabButton
          style={{ margin: "10px" }}
          slot="end"
          onClick={() => {
            setShowPieChart(true);
          }}
          disabled={showPieChart}
        >
          <IonIcon icon={pieChart} />
        </IonFabButton>
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
