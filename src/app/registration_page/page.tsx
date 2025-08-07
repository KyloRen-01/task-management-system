"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegistration = async () => {
    if (!username || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert("User Registered");
        router.push("/login_page");
      } else {
        const error = await res.json();
        alert("Registration failed: " + error.error);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center justify-center border-2 rounded-lg border-black p-8">
        <p className="text-2xl font-bold text-black">Register</p>
        <div className="flex flex-col mt-12 gap-4 text-black">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Username:</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter here:"
              className="border-2 border-black rounded-full py-2 px-4 w-80 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Password:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter here:"
              className="border-2 border-black rounded-full py-2 px-4 w-80 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Confirm Password:</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter here:"
              className="border-2 border-black rounded-full py-2 px-4 w-80 outline-none"
            />
          </div>
          <div className="flex flex-row gap-4 justify-center mt-4">
            <div
              onClick={handleRegistration}
              className="rounded-full self-center hover:bg-black hover:text-white w-40 py-2 border-2 hover:cursor-pointer border-black text-center text-black font-semibold bg-white"
            >
              Register
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
