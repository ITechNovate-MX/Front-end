import React, { useState } from 'react';
import { UploadCard } from '../../components/UploadCard';
import { postFactura } from '../../services/facturas';

const Upload: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setStatusMessage(null);

    try {
      const result = await postFactura(file);
      console.log('Factura subida con éxito:', result);
      setStatusMessage('Archivo subido correctamente');
    } catch (error: any) {
      console.error('Error al subir el archivo:', error);
      setStatusMessage(error.message || 'Ocurrió un error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  }

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
    </div>
  );
};

export default Upload;