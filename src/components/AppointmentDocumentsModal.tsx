import React, { useState } from 'react';
import { useFetchAppointmentDocuments } from '../hooks/useAppointments';
import type { DocumentInfo } from '../features/appointment/appointmentTypes';
import { FileText, Download, Eye, X, Image, FileIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface AppointmentDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  documents: DocumentInfo[];
}

const AppointmentDocumentsModal: React.FC<AppointmentDocumentsModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  documents,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [documentsWithUrls, setDocumentsWithUrls] = useState<DocumentInfo[]>(documents);

  const { refetch, isLoading } = useFetchAppointmentDocuments(
    appointmentId,
    false // Don't auto-fetch, we'll trigger manually
  );

  const fixMinioUrl = (url: string) => {
    // Replace MinIO internal hostname with accessible URL
    // Adjust this based on your MinIO setup
    return url
      .replace('http://minio:9000', 'http://localhost:9000')
      .replace('https://minio:9000', 'http://localhost:9000');
  };

  const handleViewDocument = async (docId: string) => {
    setSelectedDocId(docId);
    
    try {
      // Fetch documents with URLs from backend
      const result = await refetch();
      if (result.data?.data) {
        setDocumentsWithUrls(result.data.data);
        
        // Find the document with URL
        const docWithUrl = result.data.data.find((d: DocumentInfo) => d._id === docId);
        if (docWithUrl?.url) {
          // Use the pre-signed URL from backend with fixed hostname
          const accessibleUrl = fixMinioUrl(docWithUrl.url);
          window.open(accessibleUrl, '_blank');
        } else {
          console.error('Document URL not found');
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setSelectedDocId(null);
    }
  };

  const handleDownloadDocument = async (docId: string, originalName: string) => {
    setSelectedDocId(docId);
    
    try {
      // Fetch documents with URLs from backend
      const result = await refetch();
      if (result.data?.data) {
        setDocumentsWithUrls(result.data.data);
        
        // Find the document with URL
        const docWithUrl = result.data.data.find((d: DocumentInfo) => d._id === docId);
        if (docWithUrl?.url) {
          // Use the pre-signed URL from backend with fixed hostname
          const accessibleUrl = fixMinioUrl(docWithUrl.url);
          
          // Fetch the file and trigger download
          const response = await fetch(accessibleUrl);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
          } else {
            console.error('Failed to download document');
          }
        } else {
          console.error('Document URL not found');
        }
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setSelectedDocId(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-600" />;
    } else if (mimeType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-600" />;
    } else {
      return <FileIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Documents du Rendez-vous</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucun document attaché</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.mimeType)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate" title={doc.originalName}>
                        {doc.originalName}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        <p>Taille: {formatFileSize(doc.size)}</p>
                        <p>Catégorie: <span className="capitalize">{doc.category}</span></p>
                        <p className="text-xs">
                          Ajouté le: {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleViewDocument(doc._id)}
                          disabled={isLoading && selectedDocId === doc._id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading && selectedDocId === doc._id ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          Voir
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(doc._id, doc.originalName)}
                          disabled={isLoading && selectedDocId === doc._id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading && selectedDocId === doc._id ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDocumentsModal;
