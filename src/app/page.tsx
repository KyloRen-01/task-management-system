"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoginPage from "./login_page/page";
import TaskManager from "./taskmanagement_page/page";
export default function Home() {
  return (
    <div>
      <LoginPage></LoginPage>
    </div>
  );
}
