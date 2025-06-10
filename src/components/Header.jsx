import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

export default function Header({ user }) {
  const nav = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    nav("/login");
  };
  return (
    <header className="bg-black shadow py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-red-500">MySaaS Stream</Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-red-400">Inicio</Link>
          {user ? (
            <>
              <Link to="/admin" className="hover:text-red-400">Panel</Link>
              <button onClick={logout} className="ml-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white">Cerrar sesión</button>
            </>
          ) : <Link to="/login" className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white">Iniciar sesión</Link>}
        </nav>
      </div>
    </header>
  );
}
