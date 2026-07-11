import { useEffect, useRef, useState } from "react";
import "./ImpactoSection.css";

function useCountUp(target: number, started: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return; // só começa quando o utilizador chegar à secção

    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return count;
}

// Dados de cada card
const stats = [
  { icon: "", value: 150,    suffix: "+", label: "Hospitais parceiros" },
  { icon: "", value: 12500,  suffix: "+", label: "Doadores cadastrados" },
  { icon: "", value: 38000,  suffix: "+", label: "Bolsas coletadas" },
  { icon: "", value: 9800,   suffix: "+", label: "Vidas salvas" },
];

export default function ImpactoSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detecta quando a secção aparece no ecrã
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="impacto-section" ref={ref}>
      <h2 className="impacto-titulo">
        Nosso <span className="impacto-destaque">Impacto</span>
      </h2>
      <p className="impacto-sub">
        Cada doação pode representar uma oportunidade de vida
      </p>

      <div className="impacto-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} started={started} />
        ))}
      </div>

      <p className="impacto-rodape">Números atualizados em tempo Real</p>
    </section>
  );
}

// Componente de cada card individual
function StatCard({ stat, started }: { stat: typeof stats[0]; started: boolean }) {
  const count = useCountUp(stat.value, started);

  return (
    <div className="impacto-card">
      <span className="impacto-icon">{stat.icon}</span>
      <span className="impacto-valor">
        {count.toLocaleString("pt-BR")}{stat.suffix}
      </span>
      <span className="impacto-label">{stat.label}</span>
    </div>
  );
}