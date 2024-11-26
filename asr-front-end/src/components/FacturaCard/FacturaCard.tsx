import * as React from 'react';
import './FacturaCard.css';
import { IFacturaCard } from './types';

/**
 * FacturaCard - Componente para mostrar la información de una factura.
 */

const FacturaCard: React.FC<IFacturaCard> = ({ cliente, folio, total }) => {
    return (
      <div className="factura-card__container">
        <h2 className="factura-card__cliente">{cliente}</h2>
        <p className="factura-card__folio">Folio: {folio}</p>
        <p className="factura-card__total">Total: ${total.toFixed(2)}</p>
      </div>
    );
  };
  
  export default FacturaCard;