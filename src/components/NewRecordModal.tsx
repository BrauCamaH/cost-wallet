import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInput,
  IonItem,
  IonCardSubtitle,
} from "@ionic/react";

const NewRecordModal = () => {
  return (
    <>
      <IonSegment value="income">
        <IonSegmentButton value="income">
          <IonLabel>Income</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="expense">
          <IonLabel>Expense</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="transfer">
          <IonLabel>Transfer</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonItem>
        <IonInput placeholder="0"></IonInput>
      </IonItem>

      <IonItem button>
        <IonCardSubtitle>Account</IonCardSubtitle>
        <IonLabel slot="end">HSBC</IonLabel>
      </IonItem>
      <IonItem button>
        <IonCardSubtitle>Category</IonCardSubtitle>
        <IonLabel slot="end">Energy</IonLabel>
      </IonItem>
    </>
  );
};

export default NewRecordModal;
