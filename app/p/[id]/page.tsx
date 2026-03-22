import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import TemplateOne from "@/components/template1/t1"; 
import { notFound } from "next/navigation";

export default async function PublicPortfolio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const identifier = resolvedParams.id;

  let userData = null;

  // 1️⃣ Sabse pehle UID se check karte hain (Fastest)
  const docRef = doc(db, "portfolios", identifier);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    userData = docSnap.data();
  } else {
    // 2️⃣ Agar UID nahi mila, toh Username field mein search karte hain
    const q = query(collection(db, "portfolios"), where("username", "==", identifier));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Pehla matching document le lo
      userData = querySnapshot.docs[0].data();
    }
  }

  // 🚫 Agar dono mein kuch nahi mila toh 404
  if (!userData) {
    return notFound();
  }

  // 🛠️ FIX: Serialization fix for Next.js Server Components
  const cleanData = JSON.parse(JSON.stringify(userData));

  return <TemplateOne data={cleanData} />;
}