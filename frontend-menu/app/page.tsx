'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [ingredientes, setIngredientes] = useState('');
  const [menu, setMenu] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoNumero, setPedidoNumero] = useState(0);
  const [horaPedido, setHoraPedido] = useState<string | null>(null);

  const generarMenu = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setMenu(null);

    try {
      const res = await fetch(`${API_URL}/api/generar-menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredientes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'El pedido no pudo despacharse.');
      }

      setMenu(data.sugerencias);
      setPedidoNumero((n) => n + 1);
      setHoraPedido(
        new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'El pedido no pudo despacharse.');
    } finally {
      setCargando(false);
    }
  };

  const lineasMenu = menu ? menu.split('\n').filter((l) => l.trim().length > 0) : [];
  const numeroPedidoTexto = String(pedidoNumero || 1).padStart(3, '0');

  return (
    <main className="min-h-screen px-6 py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-chalk-dim)]">
            Maiz Tostao Restaurante
          </p>
          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-semibold italic leading-tight text-[color:var(--color-chalk)]">
            De tu despensa{' '}
            <span className="text-[color:var(--color-copper)] not-italic">
              al menú del día
            </span>
          </h1>
          <p className="mt-4 text-[color:var(--color-chalk-dim)] text-lg leading-relaxed">
            Escribe lo que tienes a la mano. MenuMInd arma el pedido, tú lo llevas a la mesa.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2 items-start">
          {/* Libreta de pedido */}
          <div className="rounded-sm bg-[color:var(--color-paper)] text-[color:var(--color-ink)] p-7 md:p-8">
            <form onSubmit={generarMenu}>
              <label
                htmlFor="ingredientes"
                className="block font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--color-copper-dark)] mb-3"
              >
                Ingredientes disponibles
              </label>
              <textarea
                id="ingredientes"
                className="w-full bg-transparent border-0 border-b border-dashed border-[color:var(--color-paper-shadow)] p-0 pb-4 text-lg leading-relaxed placeholder:text-[color:var(--color-ink)]/35 focus:outline-none focus:border-[color:var(--color-copper)] resize-none"
                rows={5}
                placeholder="maíz, tomate, cebolla, pollo, limón..."
                value={ingredientes}
                onChange={(e) => setIngredientes(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={cargando}
                className="mt-6 w-full bg-[color:var(--color-copper)] hover:bg-[color:var(--color-copper-dark)] active:scale-[0.99] text-[color:var(--color-paper)] font-mono font-semibold uppercase tracking-[0.1em] text-sm py-4 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Enviando a cocina de MenuMind…' : 'Generar Menu'}
              </button>
            </form>
          </div>

          {/* Tiquete de cocina */}
          <div className="receipt-card animate-ticket-drop" key={pedidoNumero}>
            <div className="receipt-card__paper p-7 md:p-8 pb-8 min-h-[280px] flex flex-col">
              <div className="flex items-baseline justify-between border-b border-dashed border-[color:var(--color-paper-shadow)] pb-3 mb-5 font-mono text-xs uppercase tracking-[0.1em] text-[color:var(--color-copper-dark)]">
                <span>Creacion n.º {numeroPedidoTexto}</span>
                <span>{horaPedido ?? '--:--'}</span>
              </div>

              <div className="flex-1">
                {cargando ? (
                  <p className="font-mono text-sm text-[color:var(--color-ink)]/60">
                    Imprimiendo Ideas
                    <span className="animate-ellipsis ml-1">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </p>
                ) : error ? (
                  <div>
                    <span className="inline-block -rotate-3 border-2 border-[color:var(--color-void)] text-[color:var(--color-void)] font-mono font-semibold uppercase text-xs tracking-[0.15em] px-3 py-1 mb-4">
                      Idea anulada
                    </span>
                    <p className="font-mono text-sm leading-relaxed text-[color:var(--color-ink)]/80">
                      {error}
                    </p>
                  </div>
                ) : menu ? (
                  <div className="font-mono text-sm leading-relaxed whitespace-pre-line">
                    {lineasMenu.map((linea, i) => (
                      <p
                        key={i}
                        className="animate-ticket-drop"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        {linea}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-[color:var(--color-ink)]/50 leading-relaxed">
                    Escribe tus ingredientes y yo hago el resto :)
                  </p>
                )}
              </div>
            </div>
            <div className="receipt-perforation" />
          </div>
        </div>
      </div>
    </main>
  );
}