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
} from "@ionic/react";
import { fastFood } from "ionicons/icons";
import { formattAsCurrency } from "../utils/currency";

const LatestRecords = () => {
  return (
    <IonCard style={{ margin: "15px" }}>
      <IonCardHeader>
        <IonTitle>Latest Records</IonTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem detail button>
            <IonIcon slot="start" icon={fastFood} />
            <IonToolbar>
              <IonLabel>Energy, Utiities</IonLabel>
              <IonCardSubtitle>HSBC</IonCardSubtitle>
            </IonToolbar>
            <IonItem slot="end">
              <IonToolbar>
                <IonLabel color="success">{formattAsCurrency(526)}</IonLabel>
                <IonCardSubtitle>Dec 20</IonCardSubtitle>
              </IonToolbar>
            </IonItem>
          </IonItem>
        </IonList>
      </IonCardContent>
      <IonCardHeader>
        <IonToolbar>
          <IonButton fill="outline" slot="start">
            Show More
          </IonButton>
        </IonToolbar>
      </IonCardHeader>
    </IonCard>
  );
};

export default LatestRecords;
