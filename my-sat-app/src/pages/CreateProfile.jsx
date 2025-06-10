// src/pages/CreateProfile.jsx
import React, { useState } from "react";
import { supabase } from "../components/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  //helper function to check if user has a profile already
  const checkProfile = async () =>{
    const{data: {session}, error: sessionError} = await supabase.auth.getSession();
    if (sessionError){
      console.error(sessionError);
      return;
    }  

    const user = session?.user;
    if (!user){
      return;
    }
    console.log(user);

    //see if a profile exists for the user
    const {data: profiles, error: fetchError} = await supabase.from("profiles").select("id").eq("id", user.id);
    if (fetchError){
      console.error(fetchError);
    }
    if (profiles.length > 0){
      alert("You already have a profile associated with this account")
      navigate("/");
    }
  } ;

  //on mount, if user has a profile, redirect
  useEffect (() =>{
    checkProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const user = session.user;

    

    try {
      const { error: supabaseError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          display_name: `${firstName} ${lastName}`,
          position,
          email: user.email,
        },
      ]);

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setPosition("student");
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-center text-3xl font-extrabold text-blue-900 mb-6">
          Create Your Profile
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              />
            </div>
            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              />
            </div>
            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <select
                id="position"
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">
              Profile created successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:bg-gray-300"
          >
            {isSubmitting ? "Creating Profile..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
