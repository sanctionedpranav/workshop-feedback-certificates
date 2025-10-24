import React from "react";

interface DashboardViewportProps {
  children: React.ReactNode; // Main content like table, charts etc.
  headerActions?: React.ReactNode; // Buttons or controls for the header
  footerContent?: React.ReactNode; // Pagination or footer section
  className?: string; // Additional optional classes
}

const DashboardViewport: React.FC<DashboardViewportProps> = ({
  children,
  className = "",
}) => {


  return (
    <div className={`flex flex-col min-h-[80vh] bg-gray-50 shadow-lg rounded-lg ${className}`}>
      {/* Header */}
      {/* {
        headerActions && (
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-3 rounded-t-lg">
            <div className="flex-1">{headerActions}</div>
          </header>
        )
      } */}

      {/* Main content */}
      <main className="flex-grow overflow-auto p-6 ">
        {children}
      </main>

      {/* Footer */}
      {/* {footerContent && (
        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex justify-center">
          {footerContent}
        </footer>
      )} */}
    </div>
  );
};

export default DashboardViewport;
