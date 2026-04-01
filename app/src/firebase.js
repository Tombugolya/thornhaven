import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "thornhaven-quests.firebaseapp.com",
  databaseURL: "https://thornhaven-quests-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thornhaven-quests",
  storageBucket: "thornhaven-quests.firebasestorage.app",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:b8c4824dc1c2cf08c9f720",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)
