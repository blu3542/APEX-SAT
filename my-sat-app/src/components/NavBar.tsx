// src/components/NavBar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { Button } from "./Button";

export const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to Auth page
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        Apex Tutoring
      </Link>
      <div className="space-x-4">
        <Link to="/tests" className="hover:underline">
          Practice Tests
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <Button variant="secondary" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </nav>
  );
};
