import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDNZt9iyymSnhNzEEyjC58qNXSR4lt5Xdk",
    authDomain: "fleetstore-693b8.firebaseapp.com",
    projectId: "fleetstore-693b8",
    storageBucket: "fleetstore-693b8.appspot.com",
    messagingSenderId: "952393922404",
    appId: "1:952393922404:web:60c9055df78f3cedb2ac71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
