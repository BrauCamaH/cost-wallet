import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useLocation } from "react-router";
import "./Page.css";

type Props = {
  children: React.ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const parts = location.pathname.split("/");
  const name = parts[2];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>{children}</IonContent>
    </IonPage>
  );
};

export default Page;
