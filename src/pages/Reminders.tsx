import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonTextarea,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { add, stopwatch, trash } from "ionicons/icons";

import { useEffect, useState } from "react";
import ReminderModal from "../components/ReminderModal";

import Reminder from "../models/Reminder";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

import {
  useRemindersDispatch,
  useRemindersState,
} from "../providers/RemindersProvider";

const ReminderItem: React.FC<Reminder> = ({ id, title, body, date }) => {
  const [deleteAlert] = useIonAlert();
  const dispatch = useRemindersDispatch();

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonToolbar>
            <IonCardTitle>{title}</IonCardTitle>
            <IonCardSubtitle slot="end">
              {date &&
                new Date(date).toLocaleDateString() +
                  " " +
                  new Date(date).getHours() +
                  ":" +
                  new Date(date).getMinutes()}
            </IonCardSubtitle>
          </IonToolbar>
        </IonCardHeader>
        <IonCardContent>
          {
            <IonTextarea
              color="medium"
              disabled
              className="disabled-mss"
              autoGrow
              value={body}
            />
          }
        </IonCardContent>
        <IonToolbar>
          <IonButton
            color="danger"
            slot="end"
            onClick={() => {
              deleteAlert({
                header: "Are you sure?",
                buttons: [
                  { text: "Cancel", role: "cancel" },
                  {
                    text: "Ok",
                    role: "confirm",

                    handler: async () => {
                      try {
                        await deleteDoc(doc(db, "reminders", id));
                        dispatch({ type: "delete-reminder", payload: id });
                      } catch (error) {}
                    },
                  },
                ],
              });
            }}
          >
            <IonIcon icon={trash} />
          </IonButton>
        </IonToolbar>
      </IonCard>
    </>
  );
};

const Reminders = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useRemindersDispatch();
  const state = useRemindersState();

  useEffect(() => {
    const getReminders = async () => {
      const q = query(collection(db, "reminders"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const documents: Reminder[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));

      dispatch({ type: "set-reminders", payload: documents });
    };
    getReminders();
  }, []);

  return (
    <>
      {state.reminders.map((reminder) => (
        <ReminderItem
          key={reminder.id}
          id={reminder.id}
          body={reminder.body}
          title={reminder.title}
          date={reminder.date}
        />
      ))}

      <ReminderModal showModal={showModal} setShowModal={setShowModal} />
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton
          onClick={() => {
            setShowModal(true);
          }}
        >
          <IonIcon icon={add} />
          <IonIcon icon={stopwatch} />
        </IonFabButton>
      </IonFab>
    </>
  );
};
export default Reminders;
