import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDy5HcYwwVkdgg-nLLYUFyXc07VrmWBKvw",
  authDomain: "wechat-clone-79466.firebaseapp.com",
  projectId: "wechat-clone-79466",
  storageBucket: "wechat-clone-79466.appspot.com",
  messagingSenderId: "302514057808",
  appId: "1:302514057808:web:74bdb0a3759cde97c4d755"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
export default db;