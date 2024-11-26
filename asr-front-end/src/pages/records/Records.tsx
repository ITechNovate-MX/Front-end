import React, { useEffect, useState } from 'react';
import FacturaCard from '../../components/FacturaCard/FacturaCard';
import { IFactura } from '../../services/facturas/types';
import { getFacturas } from '../../services/facturas/getFacturas';

const Records: React.FC = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const facturasData = await getFacturas();
        setFacturas(facturasData);
      } catch (error) {
        console.error('Error al cargar las facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold font-sans text-center text-blue-800 mb-8">
        Facturas Ingresadas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {facturas.map((factura) => (
          <FacturaCard
            key={factura.folio}
            cliente={factura.cliente}
            folio={factura.folio}
            total={factura.total}
          />
        ))}
      </div>
    </div>
  );
};

export default Records;
