export interface IFactura {
    estado: any;
    fechaEmision: any; // Nunca será null.
    folio: number;
    cliente: string;
    ordenCompra: string;
    subtotal: number;
    total: number;
    metodoPago: string;
    archivoXml: string;
    moneda: string;
  }

export interface IMaterial {
    id: number;
    noParte: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    importe: number;
    iva: number; 
    factura: IFactura;
}