import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface InvoiceData {
  totalInvoices: number;
  totalAmount: number;
  overdueInvoices: number;
  monthlyData: { month: string, invoices: number }[];
}

const Home: React.FC = () => {
  const [data, setData] = useState<InvoiceData | null>(null);

  // Simulación de datos obtenidos de una API o base de datos
  useEffect(() => {
    const fetchData = async () => {
      // Aquí puedes reemplazar con una llamada a la API real para obtener los datos
      const simulatedData: InvoiceData = {
        totalInvoices: 150,
        totalAmount: 50000,
        overdueInvoices: 10,
        monthlyData: [
          { month: 'Enero', invoices: 20 },
          { month: 'Febrero', invoices: 30 },
          { month: 'Marzo', invoices: 25 },
          { month: 'Abril', invoices: 35 },
          { month: 'Mayo', invoices: 40 }
        ]
      };
      setData(simulatedData);
    };
    fetchData();
  }, []);

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const barData = {
    labels: data.monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Facturas por mes',
        data: data.monthlyData.map(item => item.invoices),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: data.monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Facturas por mes',
        data: data.monthlyData.map(item => item.invoices),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="home-container">
      <h1 className="text-4xl font-bold font-sans text-center text-blue-800 mb-8">Reporte de Facturación</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Total de Facturas</h2>
          <p className="text-4xl font-semibold">{data.totalInvoices}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Monto Total Facturado</h2>
          <p className="text-4xl font-semibold">${data.totalAmount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Facturas Vencidas</h2>
          <p className="text-4xl font-semibold text-red-600">{data.overdueInvoices}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Facturación Mensual</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Bar data={barData} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Tendencia de Facturación</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Home;