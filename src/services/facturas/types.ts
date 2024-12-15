export interface IFactura {
    estado: any;
    fechaEmision: string | number | Date;
    folio:       number;
    cliente:     string;
    ordenCompra: string;
    subtotal:    number;
    total:       number;
    metodoPago:  string;
    archivoXml:  string;
}