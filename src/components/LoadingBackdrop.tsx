import { IonBackdrop, IonSpinner } from "@ionic/react";

export default function LoadingBackdrop() {
  return (
    <>
      <IonSpinner name="dots"></IonSpinner>
      <IonBackdrop contentEditable={false} visible={true}></IonBackdrop>
    </>
  );
}
