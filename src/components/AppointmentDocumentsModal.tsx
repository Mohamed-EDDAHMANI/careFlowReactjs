import React, { useState } from 'react';
import { useFetchAppointmentDocuments } from '../hooks/useAppointments';
import type { DocumentInfo } from '../features/appointment/appointmentTypes';
import { X } from 'lucide-react';

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
  const [viewingDocument, setViewingDocument] = useState<any | null>(null);
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  const { refetch } = useFetchAppointmentDocuments(
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

  const handleViewDocument = async (doc: DocumentInfo) => {
    setLoadingDocId(doc._id);
    
    try {
      // Fetch documents with URLs from backend
      const result = await refetch();
      if (result.data?.data) {
        // Find the document with URL
        const docWithUrl = result.data.data.find((d: DocumentInfo) => d._id === doc._id);
        if (docWithUrl?.url) {
          // Use the pre-signed URL from backend with fixed hostname
          const accessibleUrl = fixMinioUrl(docWithUrl.url);
          setViewingDocument({
            ...docWithUrl,
            url: accessibleUrl,
          });
        } else {
          console.error('Document URL not found');
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoadingDocId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
                <p className="text-lg">Aucun document attaché</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                      <p className="text-xs text-gray-500">
                        {doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        disabled={loadingDocId === doc._id}
                        className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                      >
                        {loadingDocId === doc._id ? 'Loading...' : 'View'}
                      </button>
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

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{viewingDocument.originalName}</h3>
                <p className="text-sm text-gray-500">
                  {viewingDocument.category} • {(viewingDocument.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={viewingDocument.url}
                  download={viewingDocument.originalName}
                  className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
                >
                  Download
                </a>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {viewingDocument.mimeType?.startsWith('image/') ? (
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.originalName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : viewingDocument.mimeType?.includes('pdf') ? (
                <iframe
                  src={viewingDocument.url}
                  className="w-full h-full min-h-[600px]"
                  title={viewingDocument.originalName}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Preview not available for this file type</p>
                  <a
                    href={viewingDocument.url}
                    download={viewingDocument.originalName}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download to view
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentDocumentsModal;
