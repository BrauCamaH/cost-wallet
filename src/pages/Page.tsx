import {
  IonBackButton,
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
import { useHistory, useLocation } from "react-router";
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

  const history = useHistory();

  const dispatch = useUserDispatch();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButton
            onClick={async () => {
              await signOut(auth);
              dispatch({ type: "sign-out" });
              history.push("/");
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
