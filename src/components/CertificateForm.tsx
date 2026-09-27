import React from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import { CertificateData, COMPANY_DETAILS } from '../types/certificate';

interface CertificateFormProps {
  data: CertificateData;
  validationErrors: Partial<Record<keyof CertificateData, string>>;
  onChange: (field: keyof CertificateData, value: string) => void;
  onGenerateCertNumber: () => void;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
  data,
  validationErrors,
  onChange,
  onGenerateCertNumber,
}) => {
  const errorCount = Object.keys(validationErrors).length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">Consumer &amp; Project Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter exact consumer and installation details. Live A4 preview updates automatically.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          <span>Permanent Vendor: </span>
          <strong className="font-semibold text-slate-800">{COMPANY_DETAILS.name}</strong>
          <span className="mx-1.5">·</span>
          <span className="font-cert-mono">GSTIN: {COMPANY_DETAILS.gstin}</span>
        </div>
      </div>

      {errorCount > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">
              Please review {errorCount} highlighted field{errorCount > 1 ? 's' : ''} below:
            </span>{' '}
            Ensure required consumer and project details are filled before final record archiving.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Certificate No. + Auto Generator */}
        <div className="sm:col-span-2">
          <label
            htmlFor="field-certificateNo"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Certificate No. <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="field-certificateNo"
              type="text"
              value={data.certificateNo}
              onChange={(e) => onChange('certificateNo', e.target.value)}
              placeholder="e.g. SS/PC/2026/001"
              className={`flex-1 px-3 py-2 text-sm font-cert-mono bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                validationErrors.certificateNo ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            <button
              type="button"
              onClick={onGenerateCertNumber}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Generate next sequential certificate number (SS/PC/2026/001)"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-700" />
              Auto-Generate No.
            </button>
          </div>
          {validationErrors.certificateNo && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.certificateNo}</p>
          )}
        </div>

        {/* Consumer Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="field-consumerName"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Consumer Name <span className="text-red-600">*</span>
          </label>
          <input
            id="field-consumerName"
            type="text"
            value={data.consumerName}
            onChange={(e) => onChange('consumerName', e.target.value)}
            placeholder="Enter full name of the consumer"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.consumerName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.consumerName && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.consumerName}</p>
          )}
        </div>

        {/* Consumer Number */}
        <div>
          <label
            htmlFor="field-consumerNumber"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Consumer Number <span className="text-red-600">*</span>
          </label>
          <input
            id="field-consumerNumber"
            type="text"
            value={data.consumerNumber}
            onChange={(e) => onChange('consumerNumber', e.target.value)}
            placeholder="Enter electricity consumer number"
            className={`w-full px-3 py-2 text-sm font-cert-mono bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.consumerNumber ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.consumerNumber && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.consumerNumber}</p>
          )}
        </div>

        {/* Application Number */}
        <div>
          <label
            htmlFor="field-applicationNumber"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Application Number <span className="text-red-600">*</span>
          </label>
          <input
            id="field-applicationNumber"
            type="text"
            value={data.applicationNumber}
            onChange={(e) => onChange('applicationNumber', e.target.value)}
            placeholder="Enter PM Surya Ghar application no."
            className={`w-full px-3 py-2 text-sm font-cert-mono bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.applicationNumber
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-300'
            }`}
          />
          {validationErrors.applicationNumber && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.applicationNumber}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="field-address"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Address <span className="text-red-600">*</span>
          </label>
          <input
            id="field-address"
            type="text"
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Village / Town, Post Office, District, State, PIN"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.address && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.address}</p>
          )}
        </div>

        {/* Plant Capacity */}
        <div>
          <label
            htmlFor="field-plantCapacity"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Plant Capacity <span className="text-red-600">*</span>
          </label>
          <input
            id="field-plantCapacity"
            type="text"
            value={data.plantCapacity}
            onChange={(e) => onChange('plantCapacity', e.target.value)}
            placeholder="e.g. 3 kWp"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.plantCapacity ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.plantCapacity && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.plantCapacity}</p>
          )}
        </div>

        {/* Sub-Division */}
        <div>
          <label
            htmlFor="field-subDivision"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Sub-Division <span className="text-red-600">*</span>
          </label>
          <input
            id="field-subDivision"
            type="text"
            value={data.subDivision}
            onChange={(e) => onChange('subDivision', e.target.value)}
            placeholder="e.g. Mangaldai Electrical Sub-Division"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.subDivision ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.subDivision && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.subDivision}</p>
          )}
        </div>

        {/* Vendor Name */}
        <div>
          <label
            htmlFor="field-vendorName"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Vendor Name <span className="text-red-600">*</span>
          </label>
          <input
            id="field-vendorName"
            type="text"
            value={data.vendorName}
            onChange={(e) => onChange('vendorName', e.target.value)}
            placeholder="M/S S.S ENTERPRISE"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.vendorName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.vendorName && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.vendorName}</p>
          )}
        </div>

        {/* Installation / Completion Date */}
        <div>
          <label
            htmlFor="field-completionDate"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Installation / Completion Date <span className="text-red-600">*</span>
          </label>
          <input
            id="field-completionDate"
            type="date"
            value={data.completionDate}
            onChange={(e) => onChange('completionDate', e.target.value)}
            className={`w-full px-3 py-2 text-sm font-cert-mono bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.completionDate ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.completionDate && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.completionDate}</p>
          )}
        </div>

        {/* Place */}
        <div className="sm:col-span-2">
          <label htmlFor="field-place" className="block text-xs font-semibold text-slate-700 mb-1">
            Place <span className="text-red-600">*</span>
          </label>
          <input
            id="field-place"
            type="text"
            value={data.place}
            onChange={(e) => onChange('place', e.target.value)}
            placeholder="e.g. Darrang (Assam)"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 ${
              validationErrors.place ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {validationErrors.place && (
            <p className="text-[11px] text-red-600 mt-1">{validationErrors.place}</p>
          )}
        </div>

        {/* Other Details / Remarks */}
        <div className="sm:col-span-2">
          <label
            htmlFor="field-otherDetails"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Other Details / Remarks <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="field-otherDetails"
            rows={2}
            value={data.otherDetails}
            onChange={(e) => onChange('otherDetails', e.target.value)}
            placeholder="Inverter make/serial no., solar module details, net meter serial number, or remarks (if any)"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
          />
        </div>
      </div>
    </div>
  );
};
