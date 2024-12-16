import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getFacturas, getDetalles } from '../../services/';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface MonthlyData {
  month: string;
  invoices: number;
  totalAmount: number;
  pending: number;
  overdue: number;
}

interface YearlyData {
  year: number;
  monthlyData: MonthlyData[];
}

interface InvoiceData {
  totalInvoices: number;
  totalAmount: number;
  overdueInvoices: number;
  pendingInvoices: number;
  yearlyData: YearlyData[];
}

const Home: React.FC = () => {
  const [data, setData] = useState<InvoiceData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturas = await getFacturas();
        const detalles = await getDetalles(0);

        // Procesar datos
        const yearlyData: Record<number, YearlyData> = {};

        facturas.forEach(factura => {
          const date = new Date(factura.fechaEmision);
          const year = date.getFullYear();
          const month = date.toLocaleString('es-ES', { month: 'long' });

          if (!yearlyData[year]) {
            yearlyData[year] = {
              year,
              monthlyData: [],
            };
          }

          const existingMonth = yearlyData[year].monthlyData.find(item => item.month === month);

          // Buscar detalles de la factura
          const detalle = detalles.find(d => d.facturaId === factura.folio);

          // Convertir el total a MXN si es necesario
          let totalInMXN = factura.total;
          if (factura.moneda !== 'MXN' && detalle && detalle.tipoCambio) {
            totalInMXN = factura.total * detalle.tipoCambio;
          }

          const isOverdue = detalle ? detalle.estatus === 'vencida' : false;
          const isPending = detalle ? detalle.estatus === 'pendiente' : false;

          if (existingMonth) {
            existingMonth.invoices += 1;
            existingMonth.totalAmount += totalInMXN; // Sumar en MXN
            if (isOverdue) existingMonth.overdue += 1;
            if (isPending) existingMonth.pending += 1;
          } else {
            yearlyData[year].monthlyData.push({
              month,
              invoices: 1,
              totalAmount: totalInMXN, // Inicializar en MXN
              overdue: isOverdue ? 1 : 0,
              pending: isPending ? 1 : 0,
            });
          }
        });

        const allYears = Object.values(yearlyData);
        const totalInvoices = facturas.length;
        const totalAmount = facturas.reduce((sum, factura) => {
          const detalle = detalles.find(d => d.facturaId === factura.folio);
          return sum + (factura.moneda !== 'MXN' && detalle?.tipoCambio ? factura.total * detalle.tipoCambio : factura.total);
        }, 0);
        const overdueInvoices = detalles.filter(d => d.estatus === 'vencida').length;
        const pendingInvoices = detalles.filter(d => d.estatus === 'pendiente').length;

        setData({
          totalInvoices,
          totalAmount,
          overdueInvoices,
          pendingInvoices,
          yearlyData: allYears,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const yearlyGraphs = data.yearlyData.map(yearData => {
    const barData = {
      labels: yearData.monthlyData.map(item => item.month),
      datasets: [
        {
          label: `Total Facturado en MXN`,
          data: yearData.monthlyData.map(item => item.totalAmount),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    };

    const options = {
      plugins: {
        tooltip: {
          callbacks: {
            afterLabel: (tooltipItem: any) => {
              const monthData = yearData.monthlyData[tooltipItem.dataIndex];
              return [
                `Facturas pendientes: ${monthData.pending}`,
                `Facturas vencidas: ${monthData.overdue}`,
              ];
            },
          },
        },
      },
    };

    const lineData = {
      labels: yearData.monthlyData.map(item => item.month),
      datasets: [
        {
          label: `Tendencia de facturación (${yearData.year}) en MXN`,
          data: yearData.monthlyData.map(item => item.totalAmount),
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
          tension: 0.4,
        },
      ],
    };

    return { year: yearData.year, barData, options, lineData };
  });

  const currentYear = new Date().getFullYear();
  const previousYearData = data.yearlyData.find(y => y.year === currentYear - 1);
  const currentYearData = data.yearlyData.find(y => y.year === currentYear);

  const comparisonData = {
    labels: previousYearData
      ? previousYearData.monthlyData.map(item => item.month)
      : currentYearData?.monthlyData.map(item => item.month) || [],
    datasets: [
      {
        label: `Facturación (${currentYear - 1}) en MXN`,
        data: previousYearData ? previousYearData.monthlyData.map(item => item.totalAmount) : [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: `Facturación (${currentYear}) en MXN`,
        data: currentYearData ? currentYearData.monthlyData.map(item => item.totalAmount) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="home-container">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Dashboard Global</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-blue-950 mb-4">Facturas Vencidas</h2>
          <p className="text-4xl font-semibold text-red-600">{data.overdueInvoices}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-blue-950 mb-4">Facturas Pendientes</h2>
          <p className="text-4xl font-semibold text-yellow-600">{data.pendingInvoices}</p>
        </div>
      </div>

      {yearlyGraphs.map(graph => (
        <div key={graph.year} className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-950 mb-4">Facturación Mensual ({graph.year})</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Bar data={graph.barData} options={graph.options} />
          </div>

          <h2 className="text-2xl font-semibold text-blue-950 mt-6 mb-4">Tendencia de Facturación ({graph.year})</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Line data={graph.lineData} />
          </div>
        </div>
      ))}

      {currentYearData && previousYearData && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-950 mb-4">Comparativa Mes a Mes ({currentYear - 1} vs {currentYear})</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Bar data={comparisonData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;