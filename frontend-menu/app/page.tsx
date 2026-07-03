'use client';

import { useState } from 'react';

export default function Home() {
  const [ingredientes, setIngredientes] = useState('');
  const [menu, setMenu] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const generarMenu = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMenu(null);

    try {
      // Ojo aquí: nos conectamos al puerto 3000 de nuestra máquina donde corre el backend
      const res = await fetch('http://localhost:3000/api/generar-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredientes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al conectar con el servidor');
      }

      setMenu(data.sugerencias);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-amber-600 mb-2">Optimizador de Menús - Maíz Tostao</h1>
          <p className="text-slate-600">Ingresa tu inventario Disponible</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <form onSubmit={generarMenu}>
              <div className="mb-4">
                <label className="block font-semibold mb-2" htmlFor="ingredientes">
                  Ingredientes a utilizar (separados por comas):
                </label>
                <textarea
                  id="ingredientes"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  rows={4}
                  placeholder="ej. maíz para tostar, tomates maduros, cebolla, carne..."
                  value={ingredientes}
                  onChange={(e) => setIngredientes(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {cargando ? 'Generando sugerencias...' : 'Generar Menú'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Resultado de la IA */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold border-b pb-3 mb-4">Sugerencias del ChefBot</h2>
              {cargando ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-10 width-10 border-t-2 border-b-2 border-amber-600"></div>
                </div>
              ) : menu ? (
                <div className="prose max-h-96 overflow-y-auto text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {menu}
                </div>
              ) : (
                <div className="text-center text-slate-400 h-48 flex items-center justify-center">
                  <p>Aún no has generado ningún menú. Ingresa ingredientes a la izquierda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}