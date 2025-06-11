// src/components/UserManager.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("app_users").select("*");
    if (error) console.error("Error al cargar usuarios:", error);
    else setUsers(data);
  };

  const addUser = async () => {
    const { error } = await supabase.from("app_users").insert([form]);
    if (error) {
      console.error("Error al crear usuario:", error);
    } else {
      setForm({ username: "", password: "" });
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from("app_users").delete().eq("id", id);
    if (error) console.error("Error al eliminar usuario:", error);
    else fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow mt-6">
      <h2 className="text-xl mb-4 font-semibold">👥 Gestión de Usuarios</h2>

      <div className="mb-4 space-y-2">
        <input
          placeholder="Nombre de usuario"
          className="p-2 bg-gray-700 rounded w-full"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="p-2 bg-gray-700 rounded w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={addUser}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Agregar usuario
        </button>
      </div>

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center bg-gray-700 p-2 rounded"
          >
            <span>{user.username}</span>
            <button
              onClick={() => deleteUser(user.id)}
              className="text-red-400 hover:text-red-600"
            >
              🗑️ Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
