"use client";
import { Space_Grotesk, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/header/Header";
import Footer from "@/component/footer/Footer";
import { usePathname } from "next/navigation";
import Sidebar from "@/component-admin/SideBar";
import store from "@/store/Store";
import { Provider } from "react-redux";
import Notification from "@/ui/Notification";

// Body — Hanken Grotesk (humanist, warm, highly legible).
const geistSans = Hanken_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Display — Space Grotesk (geometric grotesk; pairs on a contrast axis with Hanken).
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Mono — Space Mono, for eyebrow labels and tabular figures.
const geistMono = Space_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar = /^\/admin\/add-new-course\/[a-zA-Z0-9-]+$/.test(pathname ?? "");
  const learningPage = /^\/user\/learning\/[a-zA-Z0-9-]+$/.test(pathname ?? "");
  const isAdminAuthPage = pathname === "/admin";

  const isAdminPage = pathname.startsWith("/admin");
  

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply persisted theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
      </head>
      {hideSidebar ? (
        <body className={`${geistSans.variable} ${displayFont.variable} ${geistMono.variable} antialiased`}>
          <Provider store={store}>
          <Notification />
          {children}
          </Provider>
        </body>
      ) : isAdminPage ? (
        <body className={`${geistSans.variable} ${displayFont.variable} ${geistMono.variable} antialiased`}>
          <div className="flex">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64">
              <Provider store={store}>

              { !isAdminAuthPage && <Sidebar />}
              </Provider>
             
            </div>

            {/* Main content */}
            <div className="ml-64 flex-1 h-screen overflow-y-auto">
            <Provider store={store}>
          <Notification />
          {children}
          </Provider>
            </div>
          </div>
        </body>
      ) : (
        <body className={`${geistSans.variable} ${displayFont.variable} ${geistMono.variable} antialiased`}>
          {!learningPage?<Provider store={store}>
          <Notification />
          <Header />
          {children}
          <Footer />
          </Provider>
          : <Provider store={store}>
          <Notification />
      
          {children}
      
          </Provider>
          
        }
        </body>
      )}

    </html>
  );
}
