import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import LenisProvider from "@/components/LenisProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import FinanceAssistant from "@/components/FinanceAssistant";
export const metadata = {
  title: "Bachat Bhai",
  description: "AI Powered Finance Tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <LenisProvider>
            <ScrollProgressBar />
            <Toaster expand={false} richColors closeButton />
            <FinanceAssistant/>
            <Navbar />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </LenisProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
