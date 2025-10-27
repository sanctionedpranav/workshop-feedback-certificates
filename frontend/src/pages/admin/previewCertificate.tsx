import { useState } from "react";
import { generateCertificate } from "../../utils/generateCertificate";
import AdminSidebar from "../../components/admin/Sidebar";
import AdminTopbar from "../../components/admin/Topbar";
import DashboardViewport from "../../components/admin";
import AdminFooter from "../../components/admin/Footer";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function PreviewCertificate() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    const blob = await generateCertificate("/path/to/template.pdf", {
      name: "John Doe",
      workshopName: "React Workshop",
      collegeName: "Tech University",
      date: "2025-10-18",
    });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar role="admin" />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="p-6 flex-1">
          <DashboardViewport>
            <div className="p-6 max-w-3xl mx-auto">
              <button
                onClick={handleGenerate}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Generate Certificate
              </button>

              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  className="mt-6 w-full h-[600px] border rounded"
                ></iframe>
              )}
            </div>
          </DashboardViewport>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
