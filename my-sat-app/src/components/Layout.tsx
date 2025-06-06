// src/components/Layout.tsx
import React from "react";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mx-auto w-full max-w-8xl">{children}</div>
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-4">
        © {new Date().getFullYear()} Apex Tutoring. All rights reserved.
      </footer>
    </div>
  );
};
