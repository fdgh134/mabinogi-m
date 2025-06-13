import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const checklist = [
  {
    "title": "🌀불길한 소환의 결계",
    "description": "불길한 소환의 결계 2회 완료",
    "totalCount": 2,
    "checkedCount": 0,
    "type": "daily"
  },
  {
    "title": "🌀검은 구멍",
    "description": "검은 구멍 3회 완료",
    "totalCount": 3,
    "checkedCount": 0,
    "type": "daily"
  },
  {
    "title": "🎟️글라스기브넨 레이드",
    "description": "글라스기브넨 레이드 1회 완료",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "weekly"
  },
  {
    "title": "🎟️어비스 던전",
    "description": "어비스 던전 3회 완료",
    "totalCount": 3,
    "checkedCount": 0,
    "type": "weekly"
  },
  {
    "title": "💎요일 던전",
    "description": "요일 던전 1회 완료",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "daily"
  },
  {
    "title": "🌀심층 던전 클리어",
    "description": "심층 던전 3회 클리어",
    "totalCount": 3,
    "checkedCount": 0,
    "type": "repeat"
  },
  {
    "title": "🪓던전 클리어",
    "description": "던전 5회 클리어",
    "totalCount": 5,
    "checkedCount": 0,
    "type": "repeat"
  },
  {
    "title": "🏹사냥터 클리어",
    "description": "사냥터 5회 클리어",
    "totalCount": 5,
    "checkedCount": 0,
    "type": "repeat"
  },
  {
    "title": "🐺필드보스: 페리",
    "description": "페리 토벌 보상 1회 획득",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "weekly"
  },
  {
    "title": "🌲필드보스: 크라브바흐",
    "description": "크라브바흐 토벌 보상 1회 획득",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "weekly"
  },
  {
    "title": "🦍필드보스: 크라마",
    "description": "크라마 토벌 보상 1회 획득",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "weekly"
  },
  {
    "title": "티르코네일 : 라사",
    "description": "연금술 재연소 촉매 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "티르코네일 : 레이널드",
    "description": "치명타 비약 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "티르코네일 : 퍼거스",
    "description": "합금강괴 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "두갈드아일 : 트레이시",
    "description": "오르골, 생가죽 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 네리스",
    "description": "특수강괴 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 아란웬",
    "description": "궁극기 비약, 정령의 흔적 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 마누스",
    "description": "생명의 마나석 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 제롬",
    "description": "실크, 상급 실크 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 제이미",
    "description": "상급 옷감, 상급 옷감+ 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 시몬",
    "description": "염색약 베이스 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "던바튼 : 발터",
    "description": "상급 목재 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  },
  {
    "title": "콜헨 : 케아라",
    "description": "상급 치명타 비약 교환",
    "totalCount": 1,
    "checkedCount": 0,
    "type": "trade"
  }
]

async function upload() {
  const ref = collection(db, "checklist");

  for (const item of checklist) {
    await addDoc(ref, item);
    console.log(`✅ 등록됨: ${item.title}`);
  }

  console.log("🔥 전체 업로드 완료!");
}

upload();
