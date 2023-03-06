import { useRef, useState } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInput,
  IonItem,
  IonCardSubtitle,
  IonModal,
  IonToolbar,
  IonButton,
  IonIcon,
  IonTitle,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { db } from "../firebase";

import { useAccountsState } from "../providers/WalletProvider";
import Record from "../models/Record";

const categories = [
  "Food",
  "Internet",
  "Water Service",
  "Electricity",
  "Entertaiment",
  "Travels",
  "Shoes",
  "Clothes",
  "House",
  "Transport",
  "Other",
];

const recordType = {
  transfer: "transfer",
  income: "income",
  expense: "expense",
};

const NewRecordModal: React.FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showModal, setShowModal }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const [type, setType] = useState(recordType.income);

  const state = useAccountsState();

  const { register, setValue, handleSubmit } = useForm<Record>();

  const createRecord = handleSubmit(async (values) => {
    const { value, account, accountToTransfer, category } = values;
    try {
      if (type === recordType.income) {
        await addDoc(collection(db, "records"), {
          value,
          account,
          type,
          category: "Income",
          date: new Date(),
        });
        const ref = doc(db, "accounts", account || "");

        const acc = state.accounts.find((acc) => acc.id === account);

        const accountValue = acc?.value;
        let newValue = 0;
        if (accountValue && value) {
          newValue = accountValue + value;
        }

        await updateDoc(ref, { value: newValue });
      } else if (type === recordType.expense) {
        await addDoc(collection(db, "records"), {
          value,
          account,
          type,
          category,
          date: new Date(),
        });

        const ref = doc(db, "accounts", account || "");

        const acc = state.accounts.find((acc) => acc.id === account);

        const accountValue = acc?.value;
        let newValue = 0;
        if (accountValue && value) {
          newValue = accountValue - value;
        }
        await updateDoc(ref, { value: newValue });
      } else if (type === recordType.transfer) {
        await addDoc(collection(db, "records"), {
          value,
          account,
          type,
          category: "Transfer",
          accountToTransfer,
          date: new Date(),
        });

        const fromRef = doc(db, "accounts", account || "");

        const acc = state.accounts.find((acc) => acc.id === account);
        const accountValue = acc?.value;

        let newValue = 0;
        if (accountValue && value) {
          newValue = accountValue - value;
        }
        console.log("from value" + newValue);
        await updateDoc(fromRef, { value: newValue });

        const transferRef = doc(db, "accounts", accountToTransfer || "");

        const transfer = state.accounts.find(
          (acc) => acc.id === accountToTransfer
        );

        const transferValue = transfer?.value;
        let newTransfer = 0;
        if (transferValue && value) {
          newTransfer = transferValue + value;
        }
        console.log("new transfer" + newTransfer);

        await updateDoc(transferRef, { value: newTransfer });
      }
    } catch (error) {
      console.log(error);
    }

    modal.current?.dismiss();
    setShowModal(false);

    console.log(values);
  });

  return (
    <>
      <IonModal
        isOpen={showModal}
        ref={modal}
        onDidDismiss={() => setShowModal(false)}
      >
        <form onSubmit={createRecord}>
          <IonToolbar>
            <IonButton
              fill="clear"
              onClick={() => {
                modal.current?.dismiss();
                setShowModal(false);
              }}
              color="ligth"
              slot="start"
            >
              <IonIcon icon={close} />
            </IonButton>
            <IonTitle size="large">Create Record</IonTitle>
            <IonButton fill="clear" slot="end" color="secondary" type="submit">
              Accept
            </IonButton>
          </IonToolbar>
          <IonSegment value={type}>
            <IonSegmentButton
              value={recordType.income}
              onClick={() => setType(recordType.income)}
            >
              <IonLabel>Income</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value={recordType.expense}
              onClick={() => setType(recordType.expense)}
            >
              <IonLabel>Expense</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value={recordType.transfer}
              onClick={() => setType(recordType.transfer)}
            >
              <IonLabel>Transfer</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonItem>
            <IonInput
              {...register("value")}
              placeholder="0"
              type="number"
              onIonChange={(e) => setValue("value", parseInt(e.detail.value!))}
            ></IonInput>
          </IonItem>

          <IonItem button>
            <IonCardSubtitle>Account</IonCardSubtitle>
            <IonSelect
              {...register("account")}
              onChange={(acc) => {
                setValue("account", acc.type);
              }}
              slot="end"
              interface="action-sheet"
              value={state?.accounts[0]?.id}
              placeholder="Select account"
            >
              {state.accounts.map(({ id }) => (
                <IonSelectOption key={id} value={id}>
                  {id}
                </IonSelectOption>
              ))}
            </IonSelect>
            {type === recordType.transfer && (
              <>
                {<IonTitle slot="end">{" to "}</IonTitle>}

                <IonSelect
                  {...register("accountToTransfer")}
                  onChange={(acc) => {
                    setValue("accountToTransfer", acc.type);
                  }}
                  slot="end"
                  interface="action-sheet"
                  value={state?.accounts[0]?.id}
                  placeholder="Select account to transfer"
                >
                  {state.accounts.map(({ id }) => (
                    <IonSelectOption key={id} value={id}>
                      {id}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </>
            )}
          </IonItem>
          {type === recordType.expense && (
            <IonItem button>
              <IonCardSubtitle>Category</IonCardSubtitle>
              <IonSelect
                slot="end"
                interface="action-sheet"
                placeholder="Select Category"
                value={categories[0]}
                {...register("category")}
                onChange={(acc) => {
                  setValue("category", acc.type);
                }}
              >
                {categories.map((category, i) => (
                  <IonSelectOption key={i} value={category}>
                    {category}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          )}
        </form>
      </IonModal>
    </>
  );
};

export default NewRecordModal;
