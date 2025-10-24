import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { generateUniqueLink } from "../../utils/generateLink";
import AdminSidebar from "../../components/admin/Sidebar";
import DashboardViewport from "../../components/admin";
import AdminTopbar from "../../components/admin/Topbar";
import AdminFooter from "../../components/admin/Footer";

export default function FormList() {
  const [forms, setForms] = useState<any[]>([]);

  const fetchForms = async () => {
    const snapshot = await getDocs(collection(db, "forms"));
    setForms(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const toggleStatus = async (form: any) => {
    const newStatus = !form.status;
    const ref = doc(db, "forms", form.id);
    let updates: any = { status: newStatus };

    if (newStatus && !form.formLink) {
      updates.formLink = generateUniqueLink(form.id);
    } else if (!newStatus) {
      updates.formLink = "";
    }

    await updateDoc(ref, updates);
    fetchForms();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar role="admin" />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="p-6 flex-1">
        <DashboardViewport>
          <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Workshop Forms</h2>
              <Link
                to="/admin/forms/create"
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                + Create New
              </Link>
            </div>

            {forms.map((form) => (
              <div key={form.id} className="border p-4 rounded mb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{form.workshopName}</h3>
                  <p className="text-sm text-gray-600">
                    {form.collegeName} • {form.date} • {form.time}
                  </p>
                  {form.formLink && (
                    <p className="text-sm mt-1">
                      Link: <a href={form.formLink} target="_blank" className="text-blue-600 underline">{form.formLink}</a>
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <span>Status</span>
                    <input
                      type="checkbox"
                      checked={form.status}
                      onChange={() => toggleStatus(form)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </DashboardViewport>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
