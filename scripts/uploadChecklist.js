import { readFile } from "fs/promises";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-wKRe1T4csgtwt-2vwO42BJvTCXDoZ3U",
  authDomain: "mabinogi-m-1881b.firebaseapp.com",
  projectId: "mabinogi-m-1881b",
  storageBucket: "mabinogi-m-1881b.firebasestorage.app",
  messagingSenderId: "686664479287",
  appId: "1:686664479287:web:c649ec3875bbbc248145b2",
  measurementId: "G-Y0362SWVQJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uploadTemplateChecklist = async () => {
  const file = await readFile(new URL("./checklistData.json", import.meta.url), "utf8");
  const data = JSON.parse(file);

  const ref = collection(db, "checklist", "_template", "items");

  // ✅ 기존 데이터 삭제
  const snapshot = await getDocs(ref);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
    console.log(`🗑 삭제됨: ${docSnap.id}`);
  }

  // ✅ 새 데이터 업로드
  for (const item of data) {
    const newDocRef = doc(collection(db, "checklist", "_template", "items"));
    await setDoc(newDocRef, item);
    console.log(`✅ 등록됨: ${item.title}`);
  }

  console.log("🔥 템플릿 전체 업로드 완료!");
};

uploadTemplateChecklist();
