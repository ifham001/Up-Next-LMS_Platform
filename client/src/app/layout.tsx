"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/header/Header";
import Footer from "@/component/footer/Footer";
import { usePathname } from "next/navigation";
import Sidebar from "@/component-admin/SideBar";
import store from "@/store/Store";
import { Provider } from "react-redux";
import Notification from "@/ui/Notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      {hideSidebar ? (
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Provider store={store}>
          <Notification />
          {children}
          </Provider>
        </body>
      ) : isAdminPage ? (
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
