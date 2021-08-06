import React from "react";
import { Layout } from "./components/layout/Layout";
import { AppContextProvider } from "./contexts/AppContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";

function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <ModalProvider>
          <Layout />
        </ModalProvider>
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;
