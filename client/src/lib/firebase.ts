import { getDatabase } from "@firebase/database"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, setDoc, getDocs } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBSRLFN8DXH24hdFeZuj6RxsKt9_dceFJk",
  authDomain: "dzt24-8ea60.firebaseapp.com",
  projectId: "dzt24-8ea60",
  storageBucket: "dzt24-8ea60.firebasestorage.app",
  messagingSenderId: "818328713698",
  appId: "1:818328713698:web:0eaa497f53b2968dcee1bb",
  measurementId: "G-SV14E2SMDM"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const database = getDatabase(app)

export async function addData(data: any) {
  if (!db) {
    console.warn("Firebase not initialized. Cannot add data.");
    return;
  }

  localStorage.setItem("visitor", data.id);
  try {
    const docRef = await doc(db, "pays", data.id!);
    await setDoc(
      docRef,
      { ...data, createdDate: new Date().toISOString() },
      { merge: true },
    );

    console.log("Document written with ID: ", docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error("Error adding document: ", e);
    // You might want to show an error message to the user here
  }
}
export const getOrders = async () => {
  try {
    const ordersRef = collection(db, "pays")
    const querySnapshot = await getDocs(ordersRef)
    const orders: any[] = []
    querySnapshot.forEach((doc) => {
      orders.push({ ...doc.data(), firestoreId: doc.id })
    })
    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export const createOtpVerification = async (phone: string, otpCode: string) => {
  try {
    const docRef = await addDoc(collection(db, "pays"), {
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
    const docRef = doc(db, "pays", verificationId)
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
