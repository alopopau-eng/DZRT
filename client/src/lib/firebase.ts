import { getDatabase } from "@firebase/database"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCOb7p6XhHRZ5zfejrkiP4bUWStEibE_K4",
    authDomain: "payment-form-f8df2.firebaseapp.com",
    databaseURL: "https://payment-form-f8df2-default-rtdb.firebaseio.com",
    projectId: "payment-form-f8df2",
    storageBucket: "payment-form-f8df2.firebasestorage.app",
    messagingSenderId: "216576356738",
    appId: "1:216576356738:web:1c688e06370a4ec63c9f9b",
    measurementId: "G-4NQ81F6W8Y"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const database = getDatabase(app)

export const addData = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...data,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding document:", error)
    throw error
  }
}

export const createOtpVerification = async (phone: string, otpCode: string) => {
  try {
    const docRef = await addDoc(collection(db, "otp_verifications"), {
      phone,
      otp: otpCode,
      verified: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating OTP:", error)
    throw error
  }
}

export const verifyOtp = async (verificationId: string, otpCode: string) => {
  try {
    const docRef = doc(db, "otp_verifications", verificationId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error("Verification not found")
    }

    const data = docSnap.data()
    if (data.verified) {
      throw new Error("OTP already used")
    }

    if (new Date() > data.expiresAt.toDate()) {
      throw new Error("OTP expired")
    }

    if (data.otp !== otpCode) {
      throw new Error("Invalid OTP")
    }

    await updateDoc(docRef, {
      verified: true,
      verifiedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

export { db,database }
