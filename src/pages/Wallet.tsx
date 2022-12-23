import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import Accounts from "../components/Accounts";
import LatestRecordsCard from "../components/LatestRecords";
import NewRecordModal from "../components/NewRecordModal";

export default function Wallet() {
  return (
    <>
      <Accounts />
      <LatestRecordsCard />
      <NewRecordModal />
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  );
}
