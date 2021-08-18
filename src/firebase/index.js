import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/storage";
import 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    appId: process.env.REACT_APP_APP_ID,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore(firebaseApp);

const storage = firebase.storage();

export { firebaseApp, firebase, firestore, storage };
