import { readFile } from "fs/promises";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

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

const uploadRuneData = async () => {
  const file = await readFile(new URL("./rune.json", import.meta.url), "utf8");
  const data = JSON.parse(file);

  // 1️⃣ 기존 "runes" 컬렉션의 모든 문서 삭제
  const ref = collection(db, "runes");
  const snapshot = await getDocs(ref);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
    console.log(`🗑 삭제됨: ${docSnap.id}`);
  }

  // 2️⃣ 새 rune.json 데이터 업로드 (그룹별 1문서)
  for (const [group, runes] of Object.entries(data)) {
    await setDoc(doc(db, "runes", group), { list: runes });
    console.log(`✅ 그룹 "${group}" 업로드 완료`);
  }

  console.log("🔥 전체 rune.json 재업로드 완료!");
};

uploadRuneData();
