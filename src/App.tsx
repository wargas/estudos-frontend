import React from 'react';
import { Layout } from './components/layout/Layout';
import { AppContextProvider } from './contexts/AppContext';

function App() {
  return (
    <AppContextProvider>
      <Layout />
    </AppContextProvider>
  );
}

export default App;
