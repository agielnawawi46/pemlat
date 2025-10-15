import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/Footer";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content Area */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 relative">
          {/* Background dashboard */}
          <img
            src="/images/bg2.png"  // ✅ path benar, karena file ada di public/images
            alt="Dashboard Background"
            className="w-full h-full object-cover"
          />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
