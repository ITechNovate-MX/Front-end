export interface IFactura {
    folio:       number;
    cliente:     string;
    ordenCompra: string;
    subtotal:    number;
    total:       number;
    metodoPago:  string;
    archivoXml:  string;
}
