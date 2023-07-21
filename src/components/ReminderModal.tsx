import { useRef } from "react";
import {
  IonModal,
  IonInput,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTextarea,
  IonTitle,
  IonDatetimeButton,
  IonDatetime,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { close } from "ionicons/icons";
import { LocalNotifications } from "@capacitor/local-notifications/";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useRemindersDispatch } from "../providers/RemindersProvider";

interface ReminderModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = {
  title: string;
  message: string;
  date: any;
};

const ReminderModal: React.FC<ReminderModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const { register, setValue, handleSubmit } = useForm<FormData>({});
  const dispatch = useRemindersDispatch();

  const modal = useRef<HTMLIonModalElement>(null);

  const createReminder = handleSubmit(async ({ title, message }) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: message,
            id: new Date().getMilliseconds(),
          },
        ],
      });
      const docRef = await addDoc(collection(db, "reminders"), {
        title,
        body: message,
        createdAt: new Date(),
        date: new Date(),
      });
      dispatch({
        type: "add-reminder",
        payload: {
          id: docRef.id,
          title,
          body: message,
          createdAt: new Date(),
          date: new Date(),
        },
      });
      modal.current?.dismiss();
    } catch (e) {
      console.error("Error : ", e);
    }
  });

  return (
    <IonModal
      ref={modal}
      isOpen={showModal}
      onDidDismiss={() => {
        setShowModal(false);
      }}
    >
      <IonToolbar>
        <IonButton
          fill="clear"
          onClick={() => modal.current?.dismiss()}
          color="ligth"
          slot="start"
        >
          <IonIcon icon={close} />
        </IonButton>
        <IonTitle size="large">{"Create Reminder"}</IonTitle>
        <IonButton
          fill="clear"
          slot="end"
          color="secondary"
          onClick={createReminder}
        >
          Create
        </IonButton>
      </IonToolbar>
      <form onSubmit={createReminder}>
        <IonItem>
          <IonLabel color="secondary">Title :</IonLabel>
          <IonInput
            {...register("title")}
            placeholder="Title"
            onIonChange={(e) => setValue("title", e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel color="secondary">Message :</IonLabel>
        </IonItem>
        <IonTextarea
          autoGrow
          color="medium"
          {...register("message")}
          placeholder={"Write your Message..."}
          onIonChange={(e) => setValue("message", e.detail.value!)}
        />
        <IonItem>
          <IonLabel color="secondary">Date :</IonLabel>
          <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
        </IonItem>

        <IonModal keepContentsMounted={true}>
          <IonDatetime
            onIonChange={(e) => setValue("date", e.detail.value!)}
            id="datetime"
          ></IonDatetime>
        </IonModal>
      </form>
    </IonModal>
  );
};

export default ReminderModal;
