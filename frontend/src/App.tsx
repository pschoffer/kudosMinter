import React from 'react';
import './App.scss';
import { FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';
import firebaseConfig from './utils/firebaseConfig';
import KudosPage from './pages/KudosPage';
import KudosListPage from './pages/KudosListPage';
import { getFirestore } from 'firebase/firestore';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <KudosListPage />,
  },
  {
    path: "/kudos/:kudosId",
    element: <KudosPage />,
  }
]);

export default function App() {

  return <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseApp />
  </FirebaseAppProvider>
}

function FirebaseApp() {
  const firebaseApp = useFirebaseApp();
  const firestoreInstance = getFirestore(firebaseApp);

  return <FirestoreProvider sdk={firestoreInstance}>
    <RouterProvider router={router} />
  </FirestoreProvider>
}

