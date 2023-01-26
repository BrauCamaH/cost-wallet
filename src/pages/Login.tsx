import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToast,
} from "@ionic/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { useForm } from "react-hook-form";
import { User } from "../models/User";
import { useState } from "react";

const LoginPage = () => {
  const { register, setValue, handleSubmit } = useForm<User>();

  const [isError, setIsError] = useState(false);

  const handleLogin = handleSubmit(async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  });

  return (
    <div>
      <IonToast
        position="top"
        color="danger"
        duration={3000}
        isOpen={isError}
        message="Datos incorrectos"
        buttons={[
          {
            text: "Aceptar",
            role: "cancel",
          },
        ]}
      />
      <IonCard className="login-form">
        <IonCardHeader>
          <IonTitle>Login</IonTitle>
        </IonCardHeader>
        <IonCardContent>
          <form noValidate onSubmit={handleLogin}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked" color="primary">
                  Email
                </IonLabel>
                <IonInput
                  {...register("email")}
                  name="email"
                  type="email"
                  spellCheck={false}
                  autoCapitalize="off"
                  required
                  onIonChange={(e) => setValue("email", e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked" color="primary">
                  Contraseña
                </IonLabel>
                <IonInput
                  {...register("password")}
                  name="password"
                  type="password"
                  onIonChange={(e) => setValue("password", e.detail.value!)}
                />
              </IonItem>
            </IonList>
            <IonCol>
              <IonButton
                id="log in"
                type="submit"
                expand="block"
                color="secondary"
              >
                Login
              </IonButton>
            </IonCol>
          </form>
        </IonCardContent>
      </IonCard>
    </div>
  );
};
export default LoginPage;
