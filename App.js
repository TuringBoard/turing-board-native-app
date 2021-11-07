import React from 'react';

import { AuthContextProvider } from './app/store/auth-context';
import Stacks from './Stacks';


export default function App() {
  return (
    <AuthContextProvider>
      <Stacks />
    </AuthContextProvider>
  );
}