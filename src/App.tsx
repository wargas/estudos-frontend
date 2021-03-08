import React from 'react';
import { Layout } from './components/layout/Layout';
import { AppContextProvider } from './contexts/AppContext';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <Layout />
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;
