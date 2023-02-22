import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

//Custom Style for ionic components
import "./theme/style.css";

/* Theme variables */
import "./theme/variables.css";
import NotesPage from "./pages/Notes";

import { NotesProvider } from "./providers/NoteProvider";
import { WalletProvider } from "./providers/WalletProvider";
import Wallet from "./pages/Wallet";
import LoginPage from "./pages/Login";
import { UserProvider, useUserState } from "./providers/UserProvider";
import AccountPage from "./pages/AccountPage";

setupIonicReact();

const DefaultApp = () => {
  return (
    <IonApp>
      <UserProvider>
        <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/Login" />
            </Route>
            <Route path="/page/Login/" exact={true}>
              <NotesProvider>
                <LoginPage />
              </NotesProvider>
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </UserProvider>
    </IonApp>
  );
};

const AuthApp: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/Notes" />
            </Route>
            <Route path="/page/Login" exact={true}>
              <Redirect to="/page/Notes" />
            </Route>

            <Page>
              <Route path="/page/Notes/" exact={true}>
                <NotesProvider>
                  <NotesPage />
                </NotesProvider>
              </Route>
              <WalletProvider>
                <>
                  <Route path="/page/Wallet/:id" exact={true}>
                    <AccountPage />
                  </Route>
                  <Route path="/page/Wallet/" exact={true}>
                    <Wallet />
                  </Route>
                </>
              </WalletProvider>
            </Page>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

const AuthOrDefault = () => {
  const state = useUserState();
  if (state.user) {
    return <AuthApp />;
  } else {
    return <DefaultApp />;
  }
};

const App = () => {
  function toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle("dark", shouldAdd);
  }

  toggleDarkTheme(true);

  return (
    <UserProvider>
      <AuthOrDefault />
    </UserProvider>
  );
};

export default App;
