// eslint-disable-next-line
import { initializeApp } from './exports.js';
// import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD_6p1TT3sUsq_EFymYSnnccTNOAUnulnA',
  authDomain: 'friendsound.firebaseapp.com',
  projectId: 'friendsound',
  storageBucket: 'friendsound.appspot.com',
  messagingSenderId: '448580294849',
  appId: '1:448580294849:web:c3271af09459b1a1cfdc40',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// const auth = getAuth(firebaseApp);

// export { firebaseApp };
