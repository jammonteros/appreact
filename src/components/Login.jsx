// src/components/Login.jsx
import { useState } from "react";
import supabase from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-semibold text-center">Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
