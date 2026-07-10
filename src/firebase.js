import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA71Apgydzfdh_jwtavPJMhcqzRACJoYk0",
  authDomain: "playnext-8d01b.firebaseapp.com",
  projectId: "playnext-8d01b",
  storageBucket: "playnext-8d01b.firebasestorage.app",
  messagingSenderId: "967781242323",
  appId: "1:967781242323:web:5432bfc0655848a3e58b26"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)