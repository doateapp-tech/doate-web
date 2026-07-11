import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./DoacoesDonutChart.css";

Chart.register(...registerables);

interface PorTipo {
  tipo: string;
  total: number;
}

interface Props {
  data: PorTipo[];
}

const CORES = [
  "#E24B4A", "#378ADD", "#639922",
  "#BA7517", "#7F77DD", "#1D9E75",
  "#D85A30", "#D4537E",
];

export function DoacoesDonutChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const total = data.reduce((acc, d) => acc + d.total, 0);
    const labels = data.length > 0 ? data.map(d => d.tipo) : ["Sem dados"];
    const valores = data.length > 0 ? data.map(d => d.total) : [1];
    const cores = data.length > 0 ? data.map((_, i) => CORES[i % CORES.length]) : ["#e5e7eb"];

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: cores,
          borderWidth: 2,
          borderColor: "#fff",
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e1e2f",
            titleColor: "#fff",
            bodyColor: "rgba(255,255,255,0.8)",
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${val} doações (${pct}%)`;
              },
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data]);

  const total = data.reduce((acc, d) => acc + d.total, 0);

  return (
    <div className="donut-wrapper">
      <div className="donut-canvas-wrapper">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Gráfico de rosca com distribuição por tipo sanguíneo"
        >
          {data.map(d => `${d.tipo}: ${d.total}`).join(", ")}
        </canvas>
      </div>

      {/* LEGENDA COM VALORES VISÍVEIS */}
      <div className="donut-legenda">
        {data.length > 0 ? data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.total / total) * 100) : 0;
          return (
            <div key={d.tipo} className="donut-legenda-item">
              <span
                className="donut-legenda-cor"
                style={{ background: CORES[i % CORES.length] }}
              />
              <span className="donut-legenda-tipo">{d.tipo}</span>
              <span className="donut-legenda-total">{d.total}</span>
              <span className="donut-legenda-pct">{pct}%</span>
            </div>
          );
        }) : (
          <span className="donut-sem-dados">Sem dados disponíveis</span>
        )}
      </div>
    </div>
  );
}