// src/components/UserManager.jsx
import { useEffect, useState } from "react";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener usuarios existentes
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear nuevo usuario
  const handleCreate = async () => {
    if (!email || !password) return alert("Email y contraseña requeridos");
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) alert(data.error.message);
      else {
        alert("Usuario creado");
        setEmail("");
        setPassword("");
        fetchUsers();
      }
    } catch (err) {
      console.error("Error creando usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      <div className="mb-4">
        <input
          className="p-2 rounded bg-gray-700 mr-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 rounded bg-gray-700 mr-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-600 px-4 py-2 rounded" onClick={handleCreate} disabled={loading}>
          Crear usuario
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
              <span>{user.email}</span>
              <button className="bg-red-600 px-2 py-1 rounded" onClick={() => handleDelete(user.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
