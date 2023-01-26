import {
  IonButton,
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
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useUserDispatch } from "../providers/UserProvider";

type Props = {
  children: React.ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const parts = location.pathname.split("/");
  const name = parts[2];

  const dispatch = useUserDispatch();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButton
            onClick={async () => {
              await signOut(auth);
              dispatch({ type: "sign-out" });
            }}
            color="danger"
            slot="end"
            fill="clear"
          >
            logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>{children}</IonContent>
    </IonPage>
  );
};

export default Page;
