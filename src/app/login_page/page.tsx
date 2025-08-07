"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        alert("Login successful!");
        router.push("/taskmanagement_page");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Login error");
      console.error(error);
    }
  };

  const handleSignup = () => {
    router.push("/registration_page");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center justify-center border-2 rounded-lg border-black p-8">
        <p className="text-2xl font-bold text-black">LOGIN</p>
        <div className="flex flex-col mt-12 gap-4 text-black">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Username:</p>
            <div className="border-2 border-black rounded-full py-2 px-4 w-80">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter here:"
                className="w-full border-none outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Password:</p>
            <div className="border-2 border-black rounded-full py-2 px-4 w-80">
              <input
                type="password"
                placeholder="Enter here:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-none outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div
              onClick={handleSignup}
              className="rounded-full hover:bg-black hover:text-white w-36 py-2 border-2 cursor-pointer border-black text-center font-semibold"
            >
              SignUp
            </div>
            <div
              onClick={handleLogin}
              className="rounded-full hover:bg-black hover:text-white w-40 py-2 border-2 cursor-pointer border-black text-center font-semibold"
            >
              LOGIN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
