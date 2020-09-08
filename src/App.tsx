import React from 'react';
import { Layout } from './components/layout/Layout';
import { AppContextProvider } from './contexts/AppContext';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AppContextProvider>
      <AuthContextProvider>
        <Layout />
      </AuthContextProvider>
    </AppContextProvider>
  );
}

export default App;
