import { useState } from "react";
import { db } from "../../api/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateUniqueLink } from "../../utils/generateLink";
import AdminSidebar from "../../components/admin/Sidebar";
import AdminTopbar from "../../components/admin/Topbar";
import AdminFooter from "../../components/admin/Footer";
import DashboardViewport from "../../components/admin";

export default function FormBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [collegeName, setCollegeName] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // create form
    const formRef = await addDoc(collection(db, "forms"), {
      collegeName,
      workshopName,
      date,
      time,
      instructions,
      status,
      formLink: "",
      createdBy: user?.uid,
      createdAt: serverTimestamp(),
    });

    // generate link when toggled ON
    let formLink = "";
    if (status) {
      formLink = generateUniqueLink(formRef.id);
      await updateDoc(doc(db, "forms", formRef.id), { formLink });
    }

    alert("Form created successfully!");
    navigate("/admin/forms");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar role="admin" />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="p-6 flex-1">
          <DashboardViewport>
            <div className="max-w-4xl mx-auto mt-10 p-5 border rounded-lg bg-white shadow">
              <h2 className="text-2xl font-bold mb-4">Create Workshop Form</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="College Name"
                    className="border p-2 rounded"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Workshop Name"
                    className="border p-2 rounded"
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="border p-2 rounded"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <input
                    type="time"
                    className="border p-2 rounded"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Instructions</label>
                  <ReactQuill theme="snow" value={instructions} onChange={setInstructions} />
                </div>

                <div className="flex items-center gap-3">
                  <label className="font-medium">Activate Form:</label>
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Form
                </button>
              </form>
            </div>
          </DashboardViewport>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
