import React, { useState } from 'react';
import {
  Search,
  FolderOpen,
  Edit3,
  Trash2,
  Printer,
  RotateCcw,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { CertificateData, SearchFilters } from '../types/certificate';

interface SavedCertificatesPanelProps {
  certificates: CertificateData[];
  activeCertificateId: string;
  onOpenCertificate: (cert: CertificateData) => void;
  onEditCertificate: (cert: CertificateData) => void;
  onPrintCertificate: (cert: CertificateData) => void;
  onDeleteCertificate: (id: string) => void;
  onCreateNew: () => void;
}

export const SavedCertificatesPanel: React.FC<SavedCertificatesPanelProps> = ({
  certificates,
  activeCertificateId,
  onOpenCertificate,
  onEditCertificate,
  onPrintCertificate,
  onDeleteCertificate,
  onCreateNew,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    certificateNo: '',
    consumerName: '',
    consumerNumber: '',
    applicationNumber: '',
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      certificateNo: '',
      consumerName: '',
      consumerNumber: '',
      applicationNumber: '',
    });
  };

  const hasActiveFilters =
    filters.certificateNo.trim() !== '' ||
    filters.consumerName.trim() !== '' ||
    filters.consumerNumber.trim() !== '' ||
    filters.applicationNumber.trim() !== '';

  const filteredCertificates = certificates.filter((cert) => {
    const matchCertNo =
      !filters.certificateNo.trim() ||
      cert.certificateNo.toLowerCase().includes(filters.certificateNo.trim().toLowerCase());
    const matchConsumerName =
      !filters.consumerName.trim() ||
      cert.consumerName.toLowerCase().includes(filters.consumerName.trim().toLowerCase());
    const matchConsumerNumber =
      !filters.consumerNumber.trim() ||
      cert.consumerNumber.toLowerCase().includes(filters.consumerNumber.trim().toLowerCase());
    const matchAppNumber =
      !filters.applicationNumber.trim() ||
      cert.applicationNumber.toLowerCase().includes(filters.applicationNumber.trim().toLowerCase());

    return matchCertNo && matchConsumerName && matchConsumerNumber && matchAppNumber;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Saved Certificates ({certificates.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stored locally in your browser. Search, open, edit, print, or delete saved records.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Search Filters
          </button>
        )}
      </div>

      {/* Dedicated 4-Field Search Bar as required */}
      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Search Saved Certificates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Certificate Number
            </label>
            <input
              type="text"
              value={filters.certificateNo}
              onChange={(e) => handleFilterChange('certificateNo', e.target.value)}
              placeholder="e.g. SS/PC/2026/001"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Consumer Name
            </label>
            <input
              type="text"
              value={filters.consumerName}
              onChange={(e) => handleFilterChange('consumerName', e.target.value)}
              placeholder="Search consumer name..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Consumer Number
            </label>
            <input
              type="text"
              value={filters.consumerNumber}
              onChange={(e) => handleFilterChange('consumerNumber', e.target.value)}
              placeholder="Search consumer no..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Application Number
            </label>
            <input
              type="text"
              value={filters.applicationNumber}
              onChange={(e) => handleFilterChange('applicationNumber', e.target.value)}
              placeholder="Search application no..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Results Table / Cards */}
      <div className="mt-4">
        {certificates.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-lg">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No Saved Certificates Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Fill out the certificate form and click &ldquo;Save Certificate&rdquo; to store
              records locally in your browser for quick retrieval and printing.
            </p>
            <button
              type="button"
              onClick={onCreateNew}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Create First Certificate
            </button>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-lg">
            <p className="text-sm font-semibold text-slate-700">
              No certificates match your search criteria.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              Reset all search filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Certificate No.</th>
                  <th className="py-2.5 px-3">Consumer Name</th>
                  <th className="py-2.5 px-3">Consumer No.</th>
                  <th className="py-2.5 px-3">Application No.</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Photos</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredCertificates.map((cert) => {
                  const photoCount = Object.values(cert.photos).filter(Boolean).length;
                  const isCurrent = cert.id === activeCertificateId;
                  const isConfirmingDelete = confirmDeleteId === cert.id;

                  return (
                    <tr
                      key={cert.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isCurrent ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-cert-mono font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{cert.certificateNo || '—'}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-sans font-semibold text-amber-800">
                              · Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {cert.consumerName || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-cert-mono text-slate-700">
                        {cert.consumerNumber || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-cert-mono text-slate-700">
                        {cert.applicationNumber || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {cert.plantCapacity || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-cert-mono text-slate-600 whitespace-nowrap">
                        {cert.completionDate || '—'}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-600 tabular-nums">
                          {photoCount === 5 && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {photoCount}/5
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {isConfirmingDelete ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-red-700 mr-1">
                              Delete?
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteCertificate(cert.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-white bg-red-600 rounded hover:bg-red-700 cursor-pointer"
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 rounded hover:bg-slate-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenCertificate(cert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                              title="Open certificate in preview"
                            >
                              <FolderOpen className="w-3 h-3" />
                              Open
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditCertificate(cert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                              title="Edit certificate details"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onPrintCertificate(cert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 cursor-pointer"
                              title="Print this certificate"
                            >
                              <Printer className="w-3 h-3" />
                              Print
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(cert.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 cursor-pointer"
                              title="Delete certificate"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
