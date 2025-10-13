import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/base/Navbar.js";
import Footer from "../components/base/Footer.js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"



const MainLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <Navbar />
      <div style={{ flex: 1, padding: "1rem" }}>
        <SidebarTrigger />
        <Outlet />
      </div>
      <Footer />
    </SidebarProvider>
  );
};

export default MainLayout;
