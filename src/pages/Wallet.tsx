import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useState } from "react";
import Accounts from "../components/Accounts";
import LatestRecordsCard from "../components/LatestRecords";
import NewRecordModal from "../components/NewRecordModal";

export default function Wallet() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Accounts />
      <LatestRecordsCard />
      <NewRecordModal showModal={showModal} setShowModal={setShowModal} />
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton
          onClick={() => {
            setShowModal(true);
          }}
        >
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  );
}
