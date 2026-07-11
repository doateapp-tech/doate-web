import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./DoacoesBarChart.css";

Chart.register(...registerables);

interface PorMes {
  mes: string;
  mes_label: string;
  total: number;
}

interface Props {
  data: PorMes[];
}

export function DoacoesBarChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const labels = data.length > 0
      ? data.map(d => d.mes_label)
      : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

    const valores = data.length > 0
      ? data.map(d => d.total)
      : [0, 0, 0, 0, 0, 0];

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Doações",
          data: valores,
          backgroundColor: "#E24B4A",
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: "#C62828",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e1e2f",
            titleColor: "#fff",
            bodyColor: "rgba(255,255,255,0.8)",
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} doações`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 12 }, color: "#9ca3af" },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.05)", lineWidth: 1 },
            border: { display: false, dash: [4, 4] },
            ticks: { font: { size: 12 }, color: "#9ca3af", stepSize: 1, precision: 0 },
            beginAtZero: true,
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data]);

  return (
    <div className="bar-canvas-wrapper">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Gráfico de barras com doações por mês"
      >
        {data.map(d => `${d.mes_label} ${d.total}`).join(", ")}
      </canvas>
    </div>
  );
}