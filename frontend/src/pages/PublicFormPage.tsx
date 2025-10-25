// src/pages/PublicFormPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import UserForm from "./forms/UserForm";
import { db } from "../api/firebase";

export const PublicFormPage = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const fetchForm = async () => {
      const ref = doc(db, "forms", formId!);
      const snap = await getDoc(ref);
      if (snap.exists()) setFormData(snap.data());
    };
    fetchForm();
  }, [formId]);

  if (!formData) return <p>Loading...</p>;

  return <UserForm formId={formId!} formData={formData} />;
};
