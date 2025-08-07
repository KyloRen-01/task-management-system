"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Types
interface Task {
  id: number;
  name: string;
  time: string;
  date: string;
  place: string;
  assigned: string;
  status: string;
}

type ModalState =
  | { mode: "add" }
  | { mode: "update"; task: Task }
  | { mode: "delete"; task: Task }
  | null;

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<Omit<Task, "id">>({
    name: "",
    time: "",
    date: "",
    place: "",
    assigned: "",
    status: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login_page");
  };
  const userIdFromBackend = localStorage.getItem("userId");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId");
      setUserId(storedId);
      console.log("Loaded userId from localStorage:", storedId);
    }
  }, []);

  useEffect(() => {
    console.log("Current userId in effect:", userId);
    if (userId) fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const res = await axios.get<Task[] | { tasks: Task[] }>(
        `http://localhost:5000/api/tasks/${userId}`
      );
      console.log("Fetched tasks response:", res.data);
      let taskList: Task[];
      if (Array.isArray(res.data)) {
        taskList = res.data;
      } else if (res.data && Array.isArray((res.data as any).tasks)) {
        taskList = (res.data as { tasks: Task[] }).tasks;
      } else {
        taskList = [];
      }
      setTasks(taskList);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      alert(
        "Error fetching tasks: " +
          (error?.response?.data?.message || error.message || error)
      );
    }
  };

  const handleAdd = async () => {
    if (!userId) return;
    await axios.post("http://localhost:5000/api/tasks", {
      ...form,
      user_id: userId,
    });
    setModal(null);
    await fetchTasks();
  };

  const handleUpdate = async () => {
    if (modal?.mode === "update") {
      await axios.put(`http://localhost:5000/api/tasks/${modal.task.id}`, form);
      setModal(null);
      await fetchTasks();
    }
  };

  const handleDelete = async () => {
    if (modal?.mode === "delete") {
      await axios.delete(`http://localhost:5000/api/tasks/${modal.task.id}`);
      setModal(null);
      await fetchTasks();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openUpdateModal = (task: Task) => {
    setForm({
      name: task.name,
      time: task.time,
      date: task.date,
      place: task.place,
      assigned: task.assigned,
      status: task.status,
    });
    setModal({ mode: "update", task });
  };

  return (
    <div className="flex flex-col min-h-screen items-center p-8 bg-[#f0f6fd]">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <p className="font-bold text-4xl font-serif text-black">
          Welcome to Task Manager User <br />
          {userIdFromBackend}
        </p>
        <button
          className="bg-red-500 rounded text-white p-2 hover:cursor-pointer"
          onClick={() => setShowLogoutConfirm(true)}
        >
          LOGOUT
        </button>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 text-black space-y-4">
            <h2 className="text-lg font-bold font-serif">Confirm Logout</h2>
            <p className="font-serif">Are you sure you want to logout?</p>
            <div className="flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl shadow-md rounded-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-900 text-white text-left font-serif text-sm uppercase">
              <th className="p-4">Task Name</th>
              <th className="p-4">Time</th>
              <th className="p-4">Date</th>
              <th className="p-4">Place</th>
              <th className="p-4">Assigned</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-black overflow-y-auto text-left border-b-2 font-serif">
            {tasks.map((task) => (
              <tr key={task.id} className="p-4 hover:bg-gray-50">
                <td className="p-4">{task.name}</td>
                <td className="p-4">{task.time}</td>
                <td className="p-4">{task.date}</td>
                <td className="p-4">{task.place}</td>
                <td className="p-4">{task.assigned}</td>
                <td className="p-4">{task.status}</td>
                <td className="p-4">
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-md"
                    onChange={(e) => {
                      if (e.target.value === "Delete")
                        setModal({ mode: "delete", task });
                      if (e.target.value === "Update") openUpdateModal(task);
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Delete">Delete</option>
                    <option value="Update">Update</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="w-full hover:cursor-pointer font-serif hover:bg-gray-300 py-2 flex items-center text-center justify-center text-black font-semibold"
          onClick={() => setModal({ mode: "add" })}
        >
          Add Task +
        </div>
      </div>

      {(modal?.mode === "add" || modal?.mode === "update") && (
        <div className="fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-lg font-bold font-serif">
              {modal.mode === "add" ? "Add Task" : "Update Task"}
            </h2>
            {Object.entries(form).map(([key, value]) => (
              <input
                key={key}
                type={
                  key === "date" ? "date" : key === "time" ? "time" : "text"
                }
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full border text-black px-3 py-2 rounded-md"
              />
            ))}
            <div className="flex justify-between">
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md"
                onClick={modal.mode === "add" ? handleAdd : handleUpdate}
              >
                {modal.mode === "add" ? "Add" : "Update"}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modal?.mode === "delete" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 text-black space-y-4">
            <h2 className="text-lg font-bold font-serif">Confirm Deletion</h2>
            <p className="font-serif">
              Are you sure you want to delete task:{" "}
              <strong>{modal.task.name}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
