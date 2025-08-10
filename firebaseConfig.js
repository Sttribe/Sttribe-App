import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCauL_proQtfTiIvzX5YQQ6e-DJcJtrsAo",
    authDomain: "sttribe-85b3b.firebaseapp.com",
    projectId: "sttribe-85b3b",
    storageBucket: "sttribe-85b3b.firebasestorage.app",
    messagingSenderId: "699272671623",
    appId: "1:699272671623:web:2dbb0ead59b9aa4bf319a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
