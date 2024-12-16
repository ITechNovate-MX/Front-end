import * as React from 'react';
import './FacturaCard.css';
import { IFactura } from '../../services/facturas/types';
import { IDetalleFactura } from '../../services/detallefactura/types';

interface FacturaCardProps {
  factura: IFactura;
  detalleFactura: IDetalleFactura | null; // DetalleFactura relacionado
}

const FacturaCard: React.FC<FacturaCardProps> = ({ factura, detalleFactura }) => {
  const estado = detalleFactura?.estatus?.toUpperCase() || "SIN ESTADO";

  const getEstadoClass = () => {
    switch (estado) {
      case "VENCIDA":
        return "factura-card__estado--vencida";
      case "EN_PROGRESO":
        return "factura-card__estado--en-proceso";
      case "PENDIENTE":
        return "factura-card__estado--pendiente";
      case "PAGADA":
        return "factura-card__estado--pagada";
      default:
        return "factura-card__estado--default";
    }
  };

  const getContainerClass = () => {
    switch (estado) {
      case "VENCIDA":
        return "factura-card__container--vencida";
      case "EN_PROGRESO":
        return "factura-card__container--en-proceso";
      case "PENDIENTE":
        return "factura-card__container--pendiente";
      case "PAGADA":
        return "factura-card__container--pagada"; 
      default:
        return "";
    }
  };
  const getTotalClass = () => {
    switch (estado) {
      case "PAGADA":
        return "factura-card__total--pagada";
      default:
        return "factura-card__total--default";
    }
  }

  return (
    <div className={`factura-card__container ${getContainerClass()}`}>
      <div className="factura-card__content">
        <div className="factura-card__header">
          <h2 className="factura-card__cliente">#{factura.folio}</h2>
          <p className={`factura-card__estado ${getEstadoClass()}`}>{estado}</p>
        </div>
        <p className="factura-card__info">
          <strong>Fecha de emisión:</strong>{" "}
          {factura.fechaEmision
            ? new Date(factura.fechaEmision).toLocaleDateString()
            : "N/A"}
        </p>
        <p className="factura-card__info">
          <strong>Cliente:</strong> {factura.cliente || "N/A"}
        </p>
        <p className="factura-card__info">
          <strong>OC:</strong> {factura.ordenCompra || "N/A"}
        </p>

        {detalleFactura && (
          <div className="factura-card__detalle">
            <p className="factura-card__info">
              <strong>F. Entrega:</strong>{" "}
              {detalleFactura.fechaEntrega
                ? new Date(detalleFactura.fechaEntrega).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="factura-card__info">
              <strong>F. Vence:</strong>{" "}
              {detalleFactura.fechaVencimiento
                ? new Date(detalleFactura.fechaVencimiento).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        )}
        <p className={`factura-card__total ${getTotalClass()}`}>
          <strong>Total:</strong> ${factura.total?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  );
};

export default FacturaCard;
