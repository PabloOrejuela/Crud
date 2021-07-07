import firebase from 'firebase/app'
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBFEuzpvyjkZVBWE8dH_NFMOwKZvxlzNjU",
    authDomain: "crud-7984a.firebaseapp.com",
    projectId: "crud-7984a",
    storageBucket: "crud-7984a.appspot.com",
    messagingSenderId: "515569495250",
    appId: "1:515569495250:web:1e9bc9dd071432fd6f110b",
    measurementId: "G-WT506VBL5E"
};


export const firebaseApp = firebase.initializeApp(firebaseConfig);