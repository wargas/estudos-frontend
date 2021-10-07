import React from "react";

import { ToastContainer } from 'react-toastify'

import { Layout } from "./components/layout/Layout";
import { AppContextProvider } from "./contexts/AppContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";

import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <ModalProvider>
          <ToastContainer position="bottom-right" theme="colored" />
          <Layout />
        </ModalProvider>
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;
