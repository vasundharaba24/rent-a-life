import firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDARc-gSJpXhb5_eFVE9mjNjySRwMvEPFs",
  authDomain: "rent-a-life-981ad.firebaseapp.com",
  projectId: "rent-a-life-981ad",
  storageBucket: "rent-a-life-981ad.appspot.com",
  messagingSenderId: "168764704844",
  appId: "1:168764704844:web:41c7ca2bc064eb5eb0cce9",
  measurementId: "G-YMWL7YZ67P",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
