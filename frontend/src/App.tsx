import React from 'react';
import './App.scss';
import { FirebaseAppProvider } from 'reactfire';
import firebaseConfig from './utils/firebaseConfig';

export default function App() {

  return <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseApp />
  </FirebaseAppProvider>
}

function FirebaseApp() {
  return <div className='container'>dl</div>

}

