import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import { db } from "../../api/firebase";
import AdminSidebar from "../../components/admin/Sidebar";
import AdminTopbar from "../../components/admin/Topbar";
import DashboardViewport from "../../components/admin";
import AdminFooter from "../../components/admin/Footer";

export default function CertificateTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const fetchTemplates = async () => {
    const querySnapshot = await getDocs(collection(db, "certificateTemplates"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    setLoading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData);
      const fileUrl = res.data.secure_url;

      await addDoc(collection(db, "certificateTemplates"), {
        name: file.name,
        url: fileUrl,
        version: templates.length + 1,
        uploadedAt: serverTimestamp(),
        uploadedBy: "Admin",
      });

      alert("Template uploaded successfully!");
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar role="admin" />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="p-6 flex-1">
          <DashboardViewport>
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
              <h1 className="text-2xl font-bold mb-6">Certificate Template Management</h1>

              <div className="flex gap-4 items-center mb-6">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="border p-2 rounded"
                />
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? "Uploading..." : "Upload Template"}
                </button>
              </div>

              <h2 className="text-lg font-semibold mb-2">Available Templates</h2>
              <div className="space-y-3">
                {templates.map((tpl) => (
                  <div key={tpl.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold">{tpl.name}</p>
                      <p className="text-sm text-gray-500">Version: {tpl.version}</p>
                    </div>
                    <a
                      href={tpl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      Preview
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </DashboardViewport>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
