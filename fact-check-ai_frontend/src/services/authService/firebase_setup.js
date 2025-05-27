import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  sendEmailVerification, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJtFDvgv-ThK8rekhAx3XOO3Hek7_EZwE",
  authDomain: "fact-check257.firebaseapp.com",
  projectId: "fact-check257",
  storageBucket: "fact-check257.appspot.com",
  messagingSenderId: "451164243959",
  appId: "1:451164243959:web:17414683ef2542cdae50f2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper functions
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkEmailVerified = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user?.emailVerified || false);
  });
};