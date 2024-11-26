import React, { useRef, useState } from 'react';
import './UploadCard.css';
import { IUploadCard } from './types';

/**
 * UploadCard - Componente para manejar la carga de archivos.
 */
const UploadCard: React.FC<IUploadCard> = ({
  title,
  onFileUpload,
  uploadedMessage,
  uploadErrorMessage,
  buttonLabel = 'Buscar archivo',
}) => {
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        onFileUpload(file);
        setUploadStatus('success');
      } catch {
        setUploadStatus('error');
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Abre el diálogo para seleccionar el archivo
    }
  };

  return (
    <div className="upload-card__container">
      <h2 className="upload-card__title">{title}</h2>
      <div className="upload-card__upload-area">
        <div className="upload-card__icon">
          {/* Ícono SVG de carga */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L12 14M12 14L8 10M12 14L16 10M4 18H20"
              stroke="#FF6347"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="upload-card__drag-text">
          Arrastra para subir el archivo o
        </span>
        <input
          type="file"
          ref={fileInputRef}
          className="upload-card__input"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Ocultamos el input de tipo file
        />
        <button className="upload-card__button" onClick={handleButtonClick}>
          {buttonLabel}
        </button>
      </div>
      {uploadStatus === 'success' && uploadedMessage && (
        <p className="upload-card__message upload-card__message--success">
          {uploadedMessage}
        </p>
      )}
      {uploadStatus === 'error' && uploadErrorMessage && (
        <p className="upload-card__message upload-card__message--error">
          {uploadErrorMessage}
        </p>
      )}
    </div>
  );
};

export default UploadCard;
