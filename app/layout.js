import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import LenisProvider from "@/components/LenisProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import DisableRightClick from "@/components/DisableRightClick";
import ModernChatAssistant from "@/components/ModernChatAssistant";
export const metadata = {
  title: "Bachat Bhai",
  description: "AI Powered Finance Tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <DisableRightClick />
          <LenisProvider>
            <ScrollProgressBar />
            <Toaster expand={false} richColors closeButton />
            <ModernChatAssistant/>
            <Navbar />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </LenisProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
