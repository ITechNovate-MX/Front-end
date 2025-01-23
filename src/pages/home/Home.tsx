import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Loader } from '../../components/Loader/Loader';
import { getFacturas, getDetalles } from '../../services/';
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
import './Home.css';
import FVencidas from '../../icons/f_vencidas.svg';
import FPendientes from '../../icons/f_pendientes.svg';

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

        const yearlyData: Record<number, YearlyData> = {};

        facturas.forEach(factura => {
          // Parsear fecha de emisión correctamente en UTC
          const date = new Date(factura.fechaEmision);
          const year = date.getUTCFullYear(); // Obtener el año en UTC
          const monthIndex = date.getUTCMonth(); // Obtener el índice del mes en UTC (0 = enero, 1 = febrero, ...)
          const month = new Date(Date.UTC(year, monthIndex)).toLocaleString('es-ES', { month: 'long' }); // Nombre del mes en español

          if (!yearlyData[year]) {
            yearlyData[year] = {
              year,
              monthlyData: [],
            };
          }

          const existingMonth = yearlyData[year].monthlyData.find(item => item.month === month);

          // Buscar detalles de la factura
          const detalle = detalles.find(d => d.facturaId === factura.folio);

          // Usar el subtotal para el cálculo en MXN
          let totalInMXN = factura.subtotal;
          if (factura.moneda !== 'MXN' && detalle && detalle.tipoCambio) {
            totalInMXN = factura.subtotal * detalle.tipoCambio; // Convertir subtotal a MXN
          }

          const isOverdue = detalle ? detalle.estatus === 'vencida' : false;
          const isPending = detalle ? detalle.estatus === 'pendiente' : false;

          if (existingMonth) {
            existingMonth.invoices += 1;
            existingMonth.totalAmount += totalInMXN; // Sumar subtotales en MXN
            if (isOverdue) existingMonth.overdue += 1;
            if (isPending) existingMonth.pending += 1;
          } else {
            yearlyData[year].monthlyData.push({
              month,
              invoices: 1,
              totalAmount: totalInMXN, // Inicializar con el subtotal convertido a MXN
              overdue: isOverdue ? 1 : 0,
              pending: isPending ? 1 : 0,
            });
          }
        });

        const allYears = Object.values(yearlyData);
        const totalInvoices = facturas.length;
        const totalAmount = facturas.reduce((sum, factura) => {
          const detalle = detalles.find(d => d.facturaId === factura.folio);
          return sum + (factura.moneda !== 'MXN' && detalle?.tipoCambio ? factura.subtotal * detalle.tipoCambio : factura.subtotal);
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
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const yearlyGraphs = data.yearlyData.map(yearData => {
    const barData = {
      labels: yearData.monthlyData.map(item => item.month),
      datasets: [
        {
          label: `Total Facturado en MXN`,
          data: yearData.monthlyData.map(item => item.totalAmount),
          backgroundColor: '#344F9E', // Azul
          borderColor: '#344F9E',
          borderWidth: 1,
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
          borderColor: '#33beff',
          fill: false,
          tension: 0.4,
        },
      ],
    };

    return { year: yearData.year, barData, options, lineData };
  });

  const currentYear = new Date().getUTCFullYear();
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
        backgroundColor: '#E30613',
      },
      {
        label: `Facturación (${currentYear}) en MXN`,
        data: currentYearData ? currentYearData.monthlyData.map(item => item.totalAmount) : [],
        backgroundColor: '#344F9E',
      },
    ],
  };

  return (
    <div className="home-container">
      <p className="page-title">Dashboard Global</p>

      <div className="top-container">
        <div className="element-box-top">
          <div className='icon-container'>
            <img src={FVencidas} alt="Facturas Vencidas" className="icon" />
          </div>
          <div className='top-box-aux'>
            <p className="top-num-v">{data.overdueInvoices}</p>
            <h2 className="box-title">Facturas Vencidas</h2>
          </div>
        </div>

        <div className="top-container">
          <div className="element-box-top">
            <div className='icon-container'>
              <img src={FPendientes} alt="Facturas Pendientes" className="icon" />
            </div>
            <div className='top-box-aux'>
              <p className="top-num-p">{data.pendingInvoices}</p>
              <h2 className="box-title">Facturas Pendientes</h2>
            </div>
          </div>
        </div>
      </div>

      {yearlyGraphs.map(graph => (
        <div key={graph.year} className="mt-10">
          <h2 className="indicator-title my-2 mt-10">Facturación Mensual ({graph.year})</h2>
          <div className="element-box">
            <Bar data={graph.barData} options={graph.options} />
          </div>

          <h2 className="indicator-title my-2 mt-10">Tendencia de Facturación ({graph.year})</h2>
          <div className="element-box">
            <Line data={graph.lineData} />
          </div>
        </div>
      ))}

      {currentYearData && previousYearData && (
        <div className="mt-10">
          <h2 className="indicator-title my-2">Comparativa Mes a Mes ({currentYear - 1} vs {currentYear})</h2>
          <div className="element-box">
            <Bar data={comparisonData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;