// src/components/NavBar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { Button } from "./Button";
import { get } from "http";

export const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to Auth page
  };

  //state variables for user position
  const [position, setPosition] = React.useState<string | null>(null);

  //helper function to get user position
  const getUserPosition = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      // Fetch user profile from the database
      const { data, error } = await supabase
        .from("profiles")
        .select("position")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user position:", error);
      }
      setPosition(data?.position || null);
    }
  };

  React.useEffect(() => {
    getUserPosition();
  }, []);

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        Apex Tutoring
      </Link>
      <div className="space-x-4">
        <Link to="/tests" className="hover:underline">
          Practice Tests
        </Link>
        <Link to="/results" className="hover:underline">
          Test Results
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        {
          //Conditionally render Tutor Dashboard link if user is a tutor
          position === "tutor" && <Link to="/Tutors">Tutor Dashboard</Link>
        }
        <Button variant="secondary" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </nav>
  );
};
