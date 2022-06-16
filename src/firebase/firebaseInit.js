import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC51AYzhfKsPngtbac-u4xS7GLEuYxMy_w",
    authDomain: "fireblogss.firebaseapp.com",
    projectId: "fireblogss",
    storageBucket: "fireblogss.appspot.com",
    messagingSenderId: "102844711270",
    appId: "1:102844711270:web:21343de64aee4ad81048a7"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {timestamp};
export default firebaseApp.firestore();