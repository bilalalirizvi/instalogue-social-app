// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFG0pVbQ1dSFhWagUizb1vAJZQblNFro8",
  authDomain: "instagram-121192.firebaseapp.com",
  projectId: "instagram-121192",
  storageBucket: "instagram-121192.appspot.com",
  messagingSenderId: "625020819565",
  appId: "1:625020819565:web:f2683d627e3242f0e14764",
};

const app = initializeApp(firebaseConfig);
const provider = new FacebookAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const uploadFileFn = (name) => {
  const storageRef = ref(storage, `${name}`);
  return storageRef;
};

// const url = await getUrl(file.name);
const getUrl = async (name) => {
  return await getDownloadURL(ref(storage, `${name}`));
};

const userState = onAuthStateChanged;

export {
  auth,
  userState,
  provider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  signOut,
  updateProfile,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
  uploadFileFn,
  getUrl,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
  deleteDoc,
  onSnapshot,
};

// 422372586759632
