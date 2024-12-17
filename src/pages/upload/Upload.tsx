import React, { useState } from 'react';
import { UploadCard } from '../../components/UploadCard';
import { postFactura } from '../../services';
import { postDetalle } from '../../services';
import { IDetalleForm } from '../../components/DetalleForm/types';
import { DetalleForm } from '../../components/DetalleForm';

const Upload: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFactura, setUploadedFactura] = useState<any | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setStatusMessage(null);

    try {
      const result = await postFactura(file);
      console.log('Factura subida con éxito:', result);
      setUploadedFactura(result);
      setStatusMessage('Archivo subido correctamente');
    } catch (error: any) {
      console.error('Error al subir el archivo:', error);
      setStatusMessage(error.message || 'Ocurrió un error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDetalleSubmit = async (detalle: IDetalleForm) => {
    try {
      const result = await postDetalle(
        detalle.facturaId,
        detalle.fechaEntrega,
        detalle.fechaVencimiento,
        detalle.estatus,
        detalle.credito,
        detalle.fechaPortal
      );
      console.log('Detalle de factura guardado con éxito:', result);
      setStatusMessage('Detalle guardado correctamente.');
    } catch (error: any) {
      console.error('Error al guardar el detalle de factura:', error);
      setStatusMessage(error.message || 'Error al guardar el detalle.');
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold font-sans text-center text-blue-800 mb-8">Ingreso de Facturas</h1>
      <UploadCard
        title="Sube tu archivo de facturas"
        onFileUpload={handleFileUpload}
        uploadedMessage={statusMessage === 'Archivo subido correctamente' ? statusMessage : ''}
        uploadErrorMessage={statusMessage !== 'Archivo subido correctamente' ? statusMessage || undefined : ''}
        buttonLabel={isUploading ? 'Subiendo...' : 'Buscar archivo'}
      />

      {uploadedFactura && (
        <div className="mt-8">
          <DetalleForm
            facturaId={uploadedFactura.folio}
            onSubmit={handleDetalleSubmit}
          />
        </div>
      )}
    </div>
  );
};
export default Upload;