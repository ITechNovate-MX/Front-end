import React, { useState } from "react";
import './FacturaCard.css';
import { IFactura } from '../../services/facturas/types';
import { IDetalleFactura } from '../../services/detallefactura/types';
import { useNavigate } from 'react-router-dom';
import { DeleteButton } from '../DeleteButton';
import { deleteFactura } from '../../services';


interface FacturaCardProps {
  factura: IFactura;
  cliente: string;
  folio: number;
  total: number;
  detalleFactura: IDetalleFactura | null; // DetalleFactura relacionado
}

const FacturaCard: React.FC<FacturaCardProps> = ({ factura, detalleFactura }) => {
  const estado = detalleFactura?.estatus?.toUpperCase() === "EN_PROGRESO" 
  ? "EN PROGRESO" 
  : detalleFactura?.estatus?.toUpperCase() || "SIN ESTADO";
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/factura/${factura.folio}`);
  }

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    setStatusMessage(null);

    try {
      await deleteFactura(factura.folio);
      setStatusMessage("Factura eliminada correctamente.");
      console.log("Factura eliminada correctamente:", factura.folio);

      // Redirigir después de la eliminación
      setTimeout(() => {
        navigate("/records");
      }, 1500);
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
      setStatusMessage(
        "Ocurrió un error al intentar eliminar la factura."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getEstadoClass = () => {
    switch (estado) {
      case "VENCIDA":
        return "factura-card__estado--vencida";
      case "EN PROGRESO":
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
      case "EN PROGRESO":
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
    <div className={`factura-card__container ${getContainerClass()}`} onClick={handleCardClick}>
      <div className="factura-card__content">
        <div className="factura-card__info">
          <h2 className="font-bold text-blue-950 text-xl">{factura.folio}</h2>
          {factura.fechaEmision ? factura.fechaEmision : "N/A"}
          <p className='font-bold'>{factura.moneda}</p>
      </div>
        
        <p className="factura-card__info">
          {factura.cliente || "N/A"}
        </p>
        <p className="factura-card__info">
          <strong>OC</strong> 
          <p>{factura.ordenCompra || "N/A"}</p>
        </p>

        {detalleFactura && (
          <div className="factura-card__info">
            <p>
              <strong>Entrega</strong>
              <p>{detalleFactura.fechaEntrega
                ? detalleFactura.fechaEntrega
                : "N/A"}</p>
            </p>
            <p>
              <strong>Portal</strong>
              <p>{detalleFactura.fechaPortal
                ? detalleFactura.fechaPortal
                : "N/A"}</p>
            </p>
          </div>
        )}
        <p className="factura-card__info">
              <strong>Vencimiento</strong>{" "}
              {detalleFactura?.fechaVencimiento
                ? detalleFactura.fechaVencimiento
                : "N/A"}
        </p>
        <p className="factura-card__info">
          <strong>Crédito:</strong> {detalleFactura?.credito || "N/A"}
        </p>
      
        <p className={`factura-card__info ${getTotalClass()}`}>
          <strong>Total</strong> 
          <p>${factura.total?.toFixed(2) || "0.00"}</p>
        </p>
        
        <p className={`factura-card__estado ${getEstadoClass()}`}>{estado}</p>
        
        <p className='factura-card__deletebutton'><DeleteButton onClick={handleDeleteClick} /></p>
      </div>
    </div>
  );
};

export default FacturaCard;
