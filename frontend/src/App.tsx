import React from 'react';
import './App.scss';
import { FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';
import firebaseConfig from './utils/firebaseConfig';
import KudosPage from './pages/KudosPage';
import KudosListPage from './pages/KudosListPage';
import { getFirestore } from 'firebase/firestore';

export default function App() {

  return <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseApp />
  </FirebaseAppProvider>
}

function FirebaseApp() {
  const firebaseApp = useFirebaseApp();
  const firestoreInstance = getFirestore(firebaseApp);

  return <FirestoreProvider sdk={firestoreInstance}>
    <FinalApp />
  </FirestoreProvider>
}

function FinalApp() {
  const matchResult = window.location.pathname.match(/\/kudos\/(\d+)$/);
  const kudosId = matchResult ? matchResult[1] : null;

  if (kudosId) {
    return <KudosPage kudosId={kudosId} />
  }

  return <KudosListPage />

}

