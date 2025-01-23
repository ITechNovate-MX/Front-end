export interface IDetalleFactura {
    facturaId:        number;
    fechaEntrega:     any;
    fechaVencimiento: any;
    estatus:          string;
    credito:          number | null;
    fechaPortal:      any | null;
    tipoCambio:       number | null;
}
