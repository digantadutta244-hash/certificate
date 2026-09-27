import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CertificateData, COMPANY_DETAILS } from '../types/certificate';
import { PermanentStamp } from './PermanentStamp';

interface CertificateSheetProps {
  data: CertificateData;
  sheetRef?: React.RefObject<HTMLDivElement | null>;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return dateStr;
}

export const CertificateSheet: React.FC<CertificateSheetProps> = ({ data, sheetRef }) => {
  const designStyle = data.designStyle || 'sovereign';

  const installationPhotos = [
    {
      key: 'solarPanel' as const,
      index: '01',
      label: 'Solar Panel Installation',
      src: data.photos.solarPanel,
    },
    {
      key: 'earthing' as const,
      index: '02',
      label: 'Earthing',
      src: data.photos.earthing,
    },
    {
      key: 'lightningArrester' as const,
      index: '03',
      label: 'Lightning Arrester',
      src: data.photos.lightningArrester,
    },
    {
      key: 'otherAccessories' as const,
      index: '04',
      label: 'Other Accessories',
      src: data.photos.otherAccessories,
    },
  ];

  const visibleInstallationPhotos = data.hideEmptyPhotos
    ? installationPhotos.filter((item) => Boolean(item.src))
    : installationPhotos;

  const showProjectCompleteBox = !data.hideEmptyPhotos || Boolean(data.photos.projectComplete);
  const imgFitClass =
    data.photoFitMode === 'contain' ? 'object-contain bg-slate-50' : 'object-cover';

  const detailsRows = [
    { label: 'Consumer Name', value: data.consumerName || '—', mono: false, bold: true },
    { label: 'Consumer Number', value: data.consumerNumber || '—', mono: true, bold: false },
    { label: 'Application Number', value: data.applicationNumber || '—', mono: true, bold: false },
    { label: 'Address', value: data.address || '—', mono: false, bold: false },
    { label: 'Plant Capacity', value: data.plantCapacity || '—', mono: false, bold: true },
    { label: 'Sub-Division', value: data.subDivision || '—', mono: false, bold: false },
    { label: 'Vendor Name', value: data.vendorName || '—', mono: false, bold: true },
    {
      label: 'Installation / Completion Date',
      value: formatDisplayDate(data.completionDate) || '—',
      mono: true,
      bold: false,
    },
  ];

  // ============================================================================
  // DESIGN 2: MODERN EXECUTIVE GRID
  // ============================================================================
  if (designStyle === 'executive') {
    return (
      <div
        id={sheetRef ? 'a4-certificate-sheet' : undefined}
        ref={sheetRef}
        className="bg-white text-slate-900 relative select-text box-border overflow-hidden"
        style={{ width: '794px', height: '1123px', padding: '18px' }}
      >
        <div
          className="w-full h-full box-border flex flex-col justify-between bg-white relative"
          style={{ border: '2px solid #0b1d3a', padding: '16px 20px' }}
        >
          {/* Top Accent Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{
              background: 'linear-gradient(90deg, #0b1d3a 0%, #1e3a8a 65%, #c59b27 100%)',
            }}
          />

          {/* TOP: Split Corporate Letterhead */}
          <div>
            <div
              className="flex items-start justify-between pb-3 pt-1"
              style={{ borderBottom: '2px solid #0b1d3a' }}
            >
              <div>
                <h1
                  className="font-cert-display font-bold uppercase tracking-wider leading-none"
                  style={{ color: '#0b1d3a', fontSize: '24px' }}
                >
                  {COMPANY_DETAILS.name}
                </h1>
                <p
                  className="font-cert-sans font-semibold uppercase mt-1"
                  style={{ color: '#334155', fontSize: '11px', letterSpacing: '0.03em' }}
                >
                  {COMPANY_DETAILS.addressLine1} {COMPANY_DETAILS.addressLine2}{' '}
                  {COMPANY_DETAILS.addressLine3}
                </p>
              </div>

              <div
                className="text-right font-cert-sans px-3 py-1.5 rounded-xs"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  fontSize: '10.5px',
                }}
              >
                <div className="font-bold" style={{ color: '#0b1d3a' }}>
                  GSTIN No : <span className="font-cert-mono">{COMPANY_DETAILS.gstin}</span>
                </div>
                <div className="font-semibold text-slate-700 mt-0.5">
                  CONTACT NO. – <span className="font-cert-mono">{COMPANY_DETAILS.contactNo}</span>
                </div>
                <div className="font-medium text-slate-600 mt-0.5">
                  Email: {COMPANY_DETAILS.email}
                </div>
              </div>
            </div>

            {/* Scheme & Certificate Banner */}
            <div
              className="mt-2.5 px-4 py-2.5 flex items-center justify-between"
              style={{
                backgroundColor: '#0b1d3a',
                borderBottom: '3px solid #c59b27',
              }}
            >
              <div>
                <div
                  className="font-cert-sans font-bold uppercase tracking-widest"
                  style={{ color: '#facc15', fontSize: '11.5px', letterSpacing: '0.1em' }}
                >
                  PM SURYA GHAR- MUFT BIJULI YOJONA
                </div>
                <h2
                  className="font-cert-display font-bold uppercase text-white tracking-wider mt-0.5"
                  style={{ fontSize: '18px' }}
                >
                  PROJECT COMPLETION CERTIFICATE
                </h2>
              </div>

              <div className="text-right font-cert-sans text-white" style={{ fontSize: '11px' }}>
                <div>
                  <span className="text-slate-300">Certificate No: </span>
                  <span className="font-cert-mono font-bold text-amber-300">
                    {data.certificateNo || '—'}
                  </span>
                </div>
                <div className="mt-0.5">
                  <span className="text-slate-300">Date: </span>
                  <span className="font-cert-mono font-semibold text-white">
                    {formatDisplayDate(data.completionDate) || '—'}
                  </span>
                </div>
              </div>
            </div>

            <p
              className="font-cert-serif text-slate-700 mt-2 leading-snug"
              style={{ fontSize: '11.5px' }}
            >
              This is to certify that the Grid-Connected Rooftop Solar Photovoltaic Power Plant
              described below has been successfully installed and tested for the following
              beneficiary consumer under the{' '}
              <strong className="font-semibold text-slate-900">
                PM Surya Ghar - Muft Bijuli Yojona
              </strong>
              .
            </p>
          </div>

          {/* SECTION 1: CONSUMER & PROJECT DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-4" style={{ backgroundColor: '#c59b27' }} />
              <h3
                className="font-cert-sans font-bold uppercase tracking-wider"
                style={{ color: '#0b1d3a', fontSize: '11.5px' }}
              >
                Consumer &amp; Project Details
              </h3>
            </div>

            <div className="flex gap-3 items-stretch" style={{ minHeight: '214px' }}>
              <div className={showProjectCompleteBox ? 'w-[63%]' : 'w-full'}>
                <table
                  className="w-full h-full border-collapse font-cert-sans"
                  style={{ border: '1px solid #94a3b8', fontSize: '11.5px' }}
                >
                  <tbody>
                    {detailsRows.map((row, idx) => (
                      <tr
                        key={row.label}
                        style={{
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom:
                            idx < detailsRows.length - 1 ? '1px solid #cbd5e1' : undefined,
                        }}
                      >
                        <td
                          className="py-1 px-2.5 font-semibold text-slate-700 w-[39%]"
                          style={{ borderRight: '1px solid #cbd5e1' }}
                        >
                          {row.label}
                        </td>
                        <td
                          className={`py-1 px-2.5 text-slate-950 break-words ${
                            row.mono ? 'font-cert-mono font-semibold' : ''
                          } ${row.bold ? 'font-bold' : 'font-medium'}`}
                        >
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showProjectCompleteBox && (
                <div
                  className="w-[37%] flex flex-col justify-between bg-white"
                  style={{ border: '1.5px solid #0b1d3a' }}
                >
                  <div
                    className="px-2.5 py-1 flex items-center justify-between text-white"
                    style={{ backgroundColor: '#0b1d3a' }}
                  >
                    <span className="font-cert-sans font-bold uppercase text-[10px] tracking-wider">
                      Project Complete Photo
                    </span>
                    {data.photos.projectComplete && (
                      <span className="inline-flex items-center gap-1 font-cert-sans font-bold text-emerald-300 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        Completed
                      </span>
                    )}
                  </div>
                  <div
                    className="relative w-full overflow-hidden flex items-center justify-center bg-slate-50"
                    style={{ height: '190px' }}
                  >
                    {data.photos.projectComplete ? (
                      <img
                        src={data.photos.projectComplete}
                        alt="Project Complete"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${imgFitClass}`}
                      />
                    ) : (
                      <div className="text-center px-3">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase">
                          Project Complete Photo
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          (Photo Not Attached)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: INSTALLATION DETAILS */}
          {visibleInstallationPhotos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4" style={{ backgroundColor: '#c59b27' }} />
                  <h3
                    className="font-cert-sans font-bold uppercase tracking-wider"
                    style={{ color: '#0b1d3a', fontSize: '11.5px' }}
                  >
                    Installation Details
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  Site Verification Photographs
                </span>
              </div>

              <div
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns: `repeat(${visibleInstallationPhotos.length}, minmax(0, 1fr))`,
                }}
              >
                {visibleInstallationPhotos.map((item) => {
                  const hasPhoto = Boolean(item.src);
                  return (
                    <div
                      key={item.key}
                      className="flex flex-col bg-white overflow-hidden"
                      style={{ border: '1px solid #94a3b8' }}
                    >
                      <div
                        className="w-full relative overflow-hidden flex items-center justify-center bg-slate-50"
                        style={{ height: '148px' }}
                      >
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={item.label}
                            referrerPolicy="no-referrer"
                            className={`w-full h-full ${imgFitClass}`}
                          />
                        ) : (
                          <div className="text-center px-2">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                              {item.label}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">(No Photo)</p>
                          </div>
                        )}
                      </div>
                      <div
                        className="px-2 py-1 border-t flex flex-col justify-between"
                        style={{
                          backgroundColor: '#f8fafc',
                          borderColor: '#cbd5e1',
                          minHeight: '38px',
                        }}
                      >
                        <div
                          className="font-cert-sans font-bold text-slate-900 leading-tight truncate"
                          style={{ fontSize: '10.5px' }}
                        >
                          {item.label}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          {hasPhoto ? (
                            <span className="inline-flex items-center gap-1 font-cert-sans font-bold text-emerald-800 text-[9.5px]">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                              Completed
                            </span>
                          ) : (
                            <span className="font-cert-sans font-medium text-slate-400 text-[9.5px]">
                              Pending Photo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OTHER DETAILS & DECLARATION */}
          <div className="space-y-2">
            <div
              className="px-2.5 py-1.5 flex items-start gap-2 font-cert-sans"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                fontSize: '11px',
              }}
            >
              <span
                className="font-bold uppercase shrink-0"
                style={{ color: '#0b1d3a', fontSize: '10.5px' }}
              >
                OTHER DETAILS:
              </span>
              <span className="text-slate-800 font-medium leading-snug break-words line-clamp-2">
                {data.otherDetails && data.otherDetails.trim().length > 0
                  ? data.otherDetails
                  : 'System installed and tested with standard MNRE & DISCOM safety compliance.'}
              </span>
            </div>

            <div
              className="px-3 py-2"
              style={{
                backgroundColor: '#f8fafc',
                borderLeft: '4px solid #0b1d3a',
                borderTop: '1px solid #cbd5e1',
                borderRight: '1px solid #cbd5e1',
                borderBottom: '1px solid #cbd5e1',
              }}
            >
              <p
                className="font-cert-serif text-slate-900 leading-snug text-justify"
                style={{ fontSize: '11.5px' }}
              >
                <strong className="font-bold uppercase tracking-wide" style={{ color: '#0b1d3a' }}>
                  Declaration:{' '}
                </strong>
                “We hereby declare that the above mentioned solar rooftop project has been
                successfully installed and tested as per the applicable requirements of PM Surya
                Ghar - Muft Bijli Yojana and is operating satisfactorily.”
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="pt-2 flex items-end justify-between"
            style={{ borderTop: '2px solid #0b1d3a' }}
          >
            <div className="font-cert-sans space-y-2 pb-1" style={{ fontSize: '12px' }}>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-800 w-14">Date :</span>
                <span className="font-cert-mono font-semibold text-slate-950 border-b border-slate-400 px-1 min-w-[140px]">
                  {formatDisplayDate(data.completionDate) || '__________________'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-800 w-14">Place :</span>
                <span className="font-semibold text-slate-950 border-b border-slate-400 px-1 min-w-[140px]">
                  {data.place || '__________________'}
                </span>
              </div>
            </div>

            <div className="text-center flex flex-col items-center pr-2">
              <div className="w-[225px] -mb-1">
                <PermanentStamp />
              </div>
              <div className="w-56 pt-1 mt-0.5" style={{ borderTop: '1px dashed #64748b' }}>
                <div
                  className="font-cert-sans font-bold uppercase tracking-wide"
                  style={{ color: '#0b1d3a', fontSize: '11px' }}
                >
                  Authorized Signature
                </div>
                <div
                  className="font-cert-display font-bold uppercase mt-0.5"
                  style={{ color: '#0b1d3a', fontSize: '12px' }}
                >
                  {COMPANY_DETAILS.name}
                </div>
                <div
                  className="font-cert-sans font-medium text-slate-600"
                  style={{ fontSize: '10px' }}
                >
                  (Proprietor / Authorized Person)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DESIGN 3: CLASSIC OFFICIAL DOCUMENT
  // ============================================================================
  if (designStyle === 'classic') {
    return (
      <div
        id={sheetRef ? 'a4-certificate-sheet' : undefined}
        ref={sheetRef}
        className="bg-white text-slate-900 relative select-text box-border overflow-hidden"
        style={{ width: '794px', height: '1123px', padding: '18px' }}
      >
        <div
          className="w-full h-full box-border relative flex flex-col"
          style={{ border: '2.5px solid #0f2547', padding: '4px' }}
        >
          <div
            className="w-full h-full box-border flex flex-col justify-between relative bg-white"
            style={{ border: '1px solid #b8860b', padding: '14px 18px' }}
          >
            {/* Corner Accents */}
            <div
              className="absolute top-1 left-1 w-3 h-3 pointer-events-none"
              style={{ borderTop: '2px solid #b8860b', borderLeft: '2px solid #b8860b' }}
            />
            <div
              className="absolute top-1 right-1 w-3 h-3 pointer-events-none"
              style={{ borderTop: '2px solid #b8860b', borderRight: '2px solid #b8860b' }}
            />
            <div
              className="absolute bottom-1 left-1 w-3 h-3 pointer-events-none"
              style={{ borderBottom: '2px solid #b8860b', borderLeft: '2px solid #b8860b' }}
            />
            <div
              className="absolute bottom-1 right-1 w-3 h-3 pointer-events-none"
              style={{ borderBottom: '2px solid #b8860b', borderRight: '2px solid #b8860b' }}
            />

            <div>
              <div className="text-center pb-2" style={{ borderBottom: '2px solid #0f2547' }}>
                <h1
                  className="font-cert-display font-bold tracking-wider uppercase leading-tight"
                  style={{ color: '#0f2547', fontSize: '23px', letterSpacing: '0.06em' }}
                >
                  {COMPANY_DETAILS.name}
                </h1>
                <p
                  className="font-cert-sans font-semibold uppercase tracking-wide mt-0.5"
                  style={{ color: '#1e293b', fontSize: '11.5px' }}
                >
                  {COMPANY_DETAILS.addressLine1} {COMPANY_DETAILS.addressLine2}{' '}
                  {COMPANY_DETAILS.addressLine3}
                </p>
                <div
                  className="flex items-center justify-center gap-3 mt-1 font-cert-sans font-semibold"
                  style={{ fontSize: '11px', color: '#0f2547' }}
                >
                  <span>Email: {COMPANY_DETAILS.email}</span>
                  <span style={{ color: '#b8860b' }}>•</span>
                  <span>GSTIN No : {COMPANY_DETAILS.gstin}</span>
                  <span style={{ color: '#b8860b' }}>•</span>
                  <span>CONTACT NO. – {COMPANY_DETAILS.contactNo}</span>
                </div>
              </div>

              <div
                className="flex items-center justify-between py-1 px-2.5 mt-1 font-cert-sans"
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #cbd5e1',
                  fontSize: '11.5px',
                }}
              >
                <div>
                  <span className="font-semibold text-slate-600">Certificate No.: </span>
                  <span className="font-cert-mono font-semibold text-slate-950">
                    {data.certificateNo || '—'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Completion Date: </span>
                  <span className="font-cert-mono font-semibold text-slate-950">
                    {formatDisplayDate(data.completionDate) || '—'}
                  </span>
                </div>
              </div>

              <div className="text-center mt-2.5 mb-2">
                <div
                  className="inline-block px-4 py-0.5 font-cert-sans font-bold uppercase tracking-widest"
                  style={{ color: '#9a6f05', fontSize: '13.5px', letterSpacing: '0.09em' }}
                >
                  PM SURYA GHAR- MUFT BIJULI YOJONA
                </div>
                <div className="mt-0.5 flex flex-col items-center">
                  <h2
                    className="font-cert-display font-bold uppercase tracking-wider"
                    style={{ color: '#0f2547', fontSize: '19px', letterSpacing: '0.07em' }}
                  >
                    PROJECT COMPLETION CERTIFICATE
                  </h2>
                  <div className="w-56 mt-0.5" style={{ height: '2px', backgroundColor: '#b8860b' }} />
                </div>
                <p
                  className="font-cert-serif text-slate-700 mt-1.5 mx-auto leading-snug"
                  style={{ fontSize: '11.5px', maxWidth: '690px' }}
                >
                  This is to certify that the Grid-Connected Rooftop Solar Photovoltaic Power Plant
                  described below has been successfully installed and tested for the following
                  beneficiary consumer under the{' '}
                  <strong className="font-semibold text-slate-900">
                    PM Surya Ghar - Muft Bijuli Yojona
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* CONSUMER & PROJECT DETAILS */}
            <div>
              <div
                className="flex items-center justify-between px-2.5 py-1 text-white font-cert-sans font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: '#0f2547',
                  borderLeft: '4px solid #d4af37',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                }}
              >
                <span>CONSUMER &amp; PROJECT DETAILS</span>
                {showProjectCompleteBox && (
                  <span className="text-[10px] font-medium tracking-normal text-amber-200">
                    Project Verification Record
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex gap-3 items-stretch" style={{ minHeight: '216px' }}>
                <div className={showProjectCompleteBox ? 'w-[63%]' : 'w-full'}>
                  <table
                    className="w-full h-full border-collapse font-cert-sans"
                    style={{ border: '1px solid #cbd5e1', fontSize: '11.5px' }}
                  >
                    <tbody>
                      {detailsRows.map((row, idx) => (
                        <tr
                          key={row.label}
                          className={idx < detailsRows.length - 1 ? 'border-b border-slate-300' : ''}
                        >
                          <td
                            className="py-1 px-2.5 font-semibold text-slate-700 w-[38%]"
                            style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #cbd5e1' }}
                          >
                            {row.label}
                          </td>
                          <td
                            className={`py-1 px-2.5 text-slate-950 break-words ${
                              row.mono ? 'font-cert-mono font-semibold' : ''
                            } ${row.bold ? 'font-bold' : 'font-medium'}`}
                          >
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {showProjectCompleteBox && (
                  <div
                    className="w-[37%] flex flex-col justify-between bg-white"
                    style={{ border: '1px solid #0f2547' }}
                  >
                    <div
                      className="px-2 py-1 flex items-center justify-between border-b"
                      style={{ backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }}
                    >
                      <span
                        className="font-cert-sans font-bold uppercase tracking-wide"
                        style={{ color: '#0f2547', fontSize: '10.5px' }}
                      >
                        Project Complete Photo
                      </span>
                      {data.photos.projectComplete && (
                        <span
                          className="inline-flex items-center gap-0.5 font-cert-sans font-bold text-emerald-800"
                          style={{ fontSize: '10px' }}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                          Completed
                        </span>
                      )}
                    </div>
                    <div
                      className="relative w-full overflow-hidden flex items-center justify-center bg-slate-50"
                      style={{ height: '190px' }}
                    >
                      {data.photos.projectComplete ? (
                        <img
                          src={data.photos.projectComplete}
                          alt="Project Complete"
                          referrerPolicy="no-referrer"
                          className={`w-full h-full ${imgFitClass}`}
                        />
                      ) : (
                        <div className="text-center px-3 py-4">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Project Complete Photo
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            (Photo Not Attached)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* INSTALLATION DETAILS */}
            {visibleInstallationPhotos.length > 0 && (
              <div className="mt-2">
                <div
                  className="flex items-center justify-between px-2.5 py-1 text-white font-cert-sans font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: '#0f2547',
                    borderLeft: '4px solid #d4af37',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span>INSTALLATION DETAILS</span>
                  <span className="text-[10px] font-medium tracking-normal text-amber-200">
                    Component-Wise Installation Evidence
                  </span>
                </div>

                <div
                  className="grid gap-2.5 mt-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${visibleInstallationPhotos.length}, minmax(0, 1fr))`,
                  }}
                >
                  {visibleInstallationPhotos.map((item) => {
                    const hasPhoto = Boolean(item.src);
                    return (
                      <div
                        key={item.key}
                        className="flex flex-col bg-white overflow-hidden"
                        style={{ border: '1px solid #cbd5e1' }}
                      >
                        <div
                          className="w-full relative overflow-hidden flex items-center justify-center bg-slate-50"
                          style={{ height: '148px' }}
                        >
                          {item.src ? (
                            <img
                              src={item.src}
                              alt={item.label}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full ${imgFitClass}`}
                            />
                          ) : (
                            <div className="text-center px-2">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                {item.label}
                              </p>
                              <p className="text-[9px] text-slate-400 mt-0.5">(No Photo)</p>
                            </div>
                          )}
                        </div>
                        <div
                          className="px-2 py-1 border-t flex flex-col justify-between"
                          style={{
                            backgroundColor: '#f8fafc',
                            borderColor: '#cbd5e1',
                            minHeight: '38px',
                          }}
                        >
                          <div
                            className="font-cert-sans font-bold text-slate-900 leading-tight truncate"
                            style={{ fontSize: '10.5px' }}
                          >
                            {item.label}
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            {hasPhoto ? (
                              <span
                                className="inline-flex items-center gap-1 font-cert-sans font-bold text-emerald-800"
                                style={{ fontSize: '9.5px' }}
                              >
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                                Completed
                              </span>
                            ) : (
                              <span
                                className="font-cert-sans font-medium text-slate-400"
                                style={{ fontSize: '9.5px' }}
                              >
                                Pending Photo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OTHER DETAILS */}
            <div className="mt-2">
              <div
                className="px-2.5 py-1.5 flex items-start gap-2 font-cert-sans"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                }}
              >
                <span
                  className="font-bold uppercase shrink-0"
                  style={{ color: '#0f2547', fontSize: '10.5px' }}
                >
                  OTHER DETAILS:
                </span>
                <span className="text-slate-800 font-medium leading-snug break-words line-clamp-2">
                  {data.otherDetails && data.otherDetails.trim().length > 0
                    ? data.otherDetails
                    : 'System installed and tested with standard MNRE & DISCOM safety compliance.'}
                </span>
              </div>
            </div>

            {/* DECLARATION */}
            <div
              className="mt-2 px-3 py-2"
              style={{ backgroundColor: '#fffbeb', border: '1px solid #e2c778' }}
            >
              <p
                className="font-cert-serif text-slate-900 leading-snug text-justify"
                style={{ fontSize: '11.5px' }}
              >
                <strong className="font-bold uppercase tracking-wide" style={{ color: '#0f2547' }}>
                  Declaration:{' '}
                </strong>
                “We hereby declare that the above mentioned solar rooftop project has been
                successfully installed and tested as per the applicable requirements of PM Surya
                Ghar - Muft Bijli Yojana and is operating satisfactorily.”
              </p>
            </div>

            {/* FOOTER */}
            <div
              className="mt-2 pt-2 flex items-end justify-between"
              style={{ borderTop: '1.5px solid #0f2547' }}
            >
              <div className="font-cert-sans space-y-2 pb-1" style={{ fontSize: '12px' }}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-800 w-14">Date :</span>
                  <span className="font-cert-mono font-semibold text-slate-950 border-b border-slate-400 px-1 min-w-[140px]">
                    {formatDisplayDate(data.completionDate) || '__________________'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-800 w-14">Place :</span>
                  <span className="font-semibold text-slate-950 border-b border-slate-400 px-1 min-w-[140px]">
                    {data.place || '__________________'}
                  </span>
                </div>
              </div>

              <div className="text-center flex flex-col items-center pr-2">
                <div className="w-[225px] -mb-1">
                  <PermanentStamp />
                </div>
                <div className="w-56 pt-1 mt-0.5" style={{ borderTop: '1px dashed #64748b' }}>
                  <div
                    className="font-cert-sans font-bold uppercase tracking-wide"
                    style={{ color: '#0f2547', fontSize: '11px' }}
                  >
                    Authorized Signature
                  </div>
                  <div
                    className="font-cert-display font-bold uppercase mt-0.5"
                    style={{ color: '#0f2547', fontSize: '12px' }}
                  >
                    {COMPANY_DETAILS.name}
                  </div>
                  <div
                    className="font-cert-sans font-medium text-slate-600"
                    style={{ fontSize: '10px' }}
                  >
                    (Proprietor / Authorized Person)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DESIGN 1 (NEW DEFAULT): SOVEREIGN ROYAL NAVY & GOLD LETTERHEAD
  // ============================================================================
  return (
    <div
      id={sheetRef ? 'a4-certificate-sheet' : undefined}
      ref={sheetRef}
      className="bg-white text-slate-900 relative select-text box-border overflow-hidden"
      style={{
        width: '794px',
        height: '1123px',
        padding: '16px',
      }}
    >
      {/* Outer Royal Navy Architectural Frame */}
      <div
        className="w-full h-full box-border relative flex flex-col"
        style={{
          border: '2px solid #0a1e3c',
          padding: '3px',
        }}
      >
        {/* Inner Gold Accent Frame */}
        <div
          className="w-full h-full box-border flex flex-col justify-between relative bg-white overflow-hidden"
          style={{
            border: '1.5px solid #c59b27',
          }}
        >
          {/* TOP SOVEREIGN LETTERHEAD BLOCK */}
          <div>
            {/* Top Navy & Gold Header Band */}
            <div
              className="px-5 pt-3 pb-2.5 text-white relative"
              style={{
                backgroundColor: '#0a1e3c',
                borderBottom: '3px solid #c59b27',
              }}
            >
              {/* Top Row: GSTIN & Contact */}
              <div
                className="flex items-center justify-between font-cert-sans font-semibold pb-1.5 mb-1.5"
                style={{
                  fontSize: '10.5px',
                  borderBottom: '1px solid rgba(197, 155, 39, 0.35)',
                  color: '#fde68a',
                }}
              >
                <span>
                  GSTIN No : <strong className="font-cert-mono text-white">{COMPANY_DETAILS.gstin}</strong>
                </span>
                <span>
                  Email: <strong className="text-white">{COMPANY_DETAILS.email}</strong>
                </span>
                <span>
                  CONTACT NO. –{' '}
                  <strong className="font-cert-mono text-white">{COMPANY_DETAILS.contactNo}</strong>
                </span>
              </div>

              {/* Company Name & Address */}
              <div className="text-center">
                <h1
                  className="font-cert-display font-bold uppercase tracking-wider leading-tight"
                  style={{
                    color: '#ffffff',
                    fontSize: '24px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {COMPANY_DETAILS.name}
                </h1>
                <p
                  className="font-cert-sans font-semibold uppercase tracking-widest mt-0.5"
                  style={{ color: '#f8fafc', fontSize: '11px', letterSpacing: '0.06em' }}
                >
                  {COMPANY_DETAILS.addressLine1} {COMPANY_DETAILS.addressLine2}{' '}
                  {COMPANY_DETAILS.addressLine3}
                </p>
              </div>
            </div>

            {/* Certificate Ref & Scheme Title Banner */}
            <div className="px-5 pt-2.5">
              <div className="grid grid-cols-12 items-center gap-2">
                {/* Left Box: Certificate No */}
                <div
                  className="col-span-4 px-2.5 py-1.5 font-cert-sans"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderLeft: '3px solid #0a1e3c',
                    fontSize: '11px',
                  }}
                >
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
                    Certificate No.
                  </div>
                  <div className="font-cert-mono font-bold text-slate-950 truncate mt-0.5">
                    {data.certificateNo || '—'}
                  </div>
                </div>

                {/* Center Crest: Scheme Title */}
                <div
                  className="col-span-4 text-center py-1.5 px-2"
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #d4af37',
                  }}
                >
                  <div
                    className="font-cert-sans font-bold uppercase leading-tight"
                    style={{ color: '#92400e', fontSize: '10.5px', letterSpacing: '0.05em' }}
                  >
                    PM SURYA GHAR-
                  </div>
                  <div
                    className="font-cert-sans font-bold uppercase leading-tight"
                    style={{ color: '#0a1e3c', fontSize: '11px', letterSpacing: '0.06em' }}
                  >
                    MUFT BIJULI YOJONA
                  </div>
                </div>

                {/* Right Box: Completion Date */}
                <div
                  className="col-span-4 px-2.5 py-1.5 font-cert-sans text-right"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRight: '3px solid #0a1e3c',
                    fontSize: '11px',
                  }}
                >
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
                    Completion Date
                  </div>
                  <div className="font-cert-mono font-bold text-slate-950 mt-0.5">
                    {formatDisplayDate(data.completionDate) || '—'}
                  </div>
                </div>
              </div>

              {/* Main Certificate Heading */}
              <div className="text-center mt-2">
                <div className="inline-flex items-center gap-3">
                  <span className="w-10 h-[1.5px]" style={{ backgroundColor: '#c59b27' }} />
                  <h2
                    className="font-cert-display font-bold uppercase"
                    style={{
                      color: '#0a1e3c',
                      fontSize: '18.5px',
                      letterSpacing: '0.07em',
                    }}
                  >
                    PROJECT COMPLETION CERTIFICATE
                  </h2>
                  <span className="w-10 h-[1.5px]" style={{ backgroundColor: '#c59b27' }} />
                </div>

                <p
                  className="font-cert-serif text-slate-700 mt-1 mx-auto leading-snug"
                  style={{ fontSize: '11.5px', maxWidth: '700px' }}
                >
                  This is to certify that the Grid-Connected Rooftop Solar Photovoltaic Power Plant
                  described below has been successfully installed and tested for the following
                  beneficiary consumer under the{' '}
                  <strong className="font-semibold text-slate-950">
                    PM Surya Ghar - Muft Bijuli Yojona
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* MIDDLE BODY: CONSUMER TABLE + PHOTOS */}
          <div className="px-5 space-y-2.5">
            {/* SECTION 1: CONSUMER & PROJECT DETAILS */}
            <div>
              <div
                className="flex items-center justify-between px-3 py-1 font-cert-sans"
                style={{
                  backgroundColor: '#0a1e3c',
                  borderBottom: '2px solid #c59b27',
                }}
              >
                <span
                  className="font-bold uppercase tracking-wider text-white"
                  style={{ fontSize: '11px', letterSpacing: '0.06em' }}
                >
                  01. Consumer &amp; Project Details
                </span>
                {showProjectCompleteBox && (
                  <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wide">
                    Beneficiary &amp; Site Record
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex gap-3 items-stretch" style={{ minHeight: '214px' }}>
                {/* Left Table */}
                <div className={showProjectCompleteBox ? 'w-[63%]' : 'w-full'}>
                  <table
                    className="w-full h-full border-collapse font-cert-sans"
                    style={{ border: '1px solid #94a3b8', fontSize: '11.5px' }}
                  >
                    <tbody>
                      {detailsRows.map((row, idx) => (
                        <tr
                          key={row.label}
                          style={{
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                            borderBottom:
                              idx < detailsRows.length - 1 ? '1px solid #cbd5e1' : undefined,
                          }}
                        >
                          <td
                            className="py-1 px-2.5 font-semibold text-slate-700 w-[39%]"
                            style={{
                              backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#f1f5f9',
                              borderRight: '1px solid #cbd5e1',
                            }}
                          >
                            {row.label}
                          </td>
                          <td
                            className={`py-1 px-2.5 text-slate-950 break-words ${
                              row.mono ? 'font-cert-mono font-semibold' : ''
                            } ${row.bold ? 'font-bold' : 'font-medium'}`}
                          >
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right Project Complete Photo */}
                {showProjectCompleteBox && (
                  <div
                    className="w-[37%] flex flex-col justify-between bg-white"
                    style={{
                      border: '1px solid #0a1e3c',
                      boxShadow: 'inset 0 0 0 1px #e2e8f0',
                    }}
                  >
                    <div
                      className="px-2.5 py-1 flex items-center justify-between border-b"
                      style={{
                        backgroundColor: '#f8fafc',
                        borderColor: '#cbd5e1',
                      }}
                    >
                      <span
                        className="font-cert-sans font-bold uppercase tracking-wide"
                        style={{ color: '#0a1e3c', fontSize: '10px' }}
                      >
                        Project Complete Photo
                      </span>
                      {data.photos.projectComplete && (
                        <span
                          className="inline-flex items-center gap-0.5 font-cert-sans font-bold text-emerald-800"
                          style={{ fontSize: '9.5px' }}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                          Completed
                        </span>
                      )}
                    </div>

                    <div
                      className="relative w-full overflow-hidden flex items-center justify-center bg-slate-50"
                      style={{ height: '188px' }}
                    >
                      {data.photos.projectComplete ? (
                        <img
                          src={data.photos.projectComplete}
                          alt="Project Complete"
                          referrerPolicy="no-referrer"
                          className={`w-full h-full ${imgFitClass}`}
                        />
                      ) : (
                        <div className="text-center px-3 py-4">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Project Complete Photo
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            (Photo Not Attached)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: INSTALLATION DETAILS */}
            {visibleInstallationPhotos.length > 0 && (
              <div>
                <div
                  className="flex items-center justify-between px-3 py-1 font-cert-sans"
                  style={{
                    backgroundColor: '#0a1e3c',
                    borderBottom: '2px solid #c59b27',
                  }}
                >
                  <span
                    className="font-bold uppercase tracking-wider text-white"
                    style={{ fontSize: '11px', letterSpacing: '0.06em' }}
                  >
                    02. Installation Details
                  </span>
                  <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wide">
                    Verified Component Photographs
                  </span>
                </div>

                <div
                  className="grid gap-2.5 mt-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${visibleInstallationPhotos.length}, minmax(0, 1fr))`,
                  }}
                >
                  {visibleInstallationPhotos.map((item) => {
                    const hasPhoto = Boolean(item.src);
                    return (
                      <div
                        key={item.key}
                        className="flex flex-col bg-white overflow-hidden"
                        style={{ border: '1px solid #94a3b8' }}
                      >
                        {/* Component Header Bar */}
                        <div
                          className="px-2 py-1 border-b flex items-center justify-between"
                          style={{
                            backgroundColor: '#f8fafc',
                            borderColor: '#cbd5e1',
                          }}
                        >
                          <span
                            className="font-cert-sans font-bold text-slate-900 truncate"
                            style={{ fontSize: '10px' }}
                            title={item.label}
                          >
                            {item.label}
                          </span>
                        </div>

                        {/* Photo Slot */}
                        <div
                          className="w-full relative overflow-hidden flex items-center justify-center bg-slate-50"
                          style={{ height: '142px' }}
                        >
                          {item.src ? (
                            <img
                              src={item.src}
                              alt={item.label}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full ${imgFitClass}`}
                            />
                          ) : (
                            <div className="text-center px-2">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                {item.label}
                              </p>
                              <p className="text-[9px] text-slate-400 mt-0.5">(No Photo)</p>
                            </div>
                          )}
                        </div>

                        {/* Status Bar */}
                        <div
                          className="px-2 py-1 border-t flex items-center justify-between"
                          style={{
                            backgroundColor: hasPhoto ? '#f0fdf4' : '#f8fafc',
                            borderColor: '#cbd5e1',
                          }}
                        >
                          {hasPhoto ? (
                            <span
                              className="inline-flex items-center gap-1 font-cert-sans font-bold text-emerald-800"
                              style={{ fontSize: '9.5px' }}
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                              Completed
                            </span>
                          ) : (
                            <span
                              className="font-cert-sans font-medium text-slate-400"
                              style={{ fontSize: '9.5px' }}
                            >
                              Pending Photo
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: OTHER DETAILS & DECLARATION */}
            <div className="space-y-1.5">
              <div
                className="px-3 py-1.5 flex items-start gap-2 font-cert-sans"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                }}
              >
                <span
                  className="font-bold uppercase shrink-0"
                  style={{ color: '#0a1e3c', fontSize: '10.5px' }}
                >
                  Other Details:
                </span>
                <span className="text-slate-800 font-medium leading-snug break-words line-clamp-2">
                  {data.otherDetails && data.otherDetails.trim().length > 0
                    ? data.otherDetails
                    : 'System installed and tested with standard MNRE & DISCOM safety compliance.'}
                </span>
              </div>

              <div
                className="px-3.5 py-2"
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #d4af37',
                  borderLeft: '4px solid #0a1e3c',
                }}
              >
                <p
                  className="font-cert-serif text-slate-900 leading-snug text-justify"
                  style={{ fontSize: '11.5px' }}
                >
                  <strong
                    className="font-bold uppercase tracking-wide"
                    style={{ color: '#0a1e3c' }}
                  >
                    Declaration:{' '}
                  </strong>
                  “We hereby declare that the above mentioned solar rooftop project has been
                  successfully installed and tested as per the applicable requirements of PM Surya
                  Ghar - Muft Bijli Yojana and is operating satisfactorily.”
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM SIGNATURE, DATE/PLACE & PERMANENT BLUE STAMP */}
          <div className="px-5 pb-3 pt-1">
            <div
              className="pt-2 flex items-end justify-between"
              style={{ borderTop: '2px solid #0a1e3c' }}
            >
              {/* Left: Date & Place */}
              <div className="font-cert-sans space-y-2 pb-1" style={{ fontSize: '12px' }}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-800 w-14">Date :</span>
                  <span className="font-cert-mono font-semibold text-slate-950 border-b border-slate-400 px-1 min-w-[145px]">
                    {formatDisplayDate(data.completionDate) || '__________________'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-800 w-14">Place :</span>
                  <span className="font-semibold text-slate-950 border-b border-slate-400 px-1 min-w-[145px]">
                    {data.place || '__________________'}
                  </span>
                </div>
              </div>

              {/* Right: Permanent Blue Stamp + Authorized Signature */}
              <div className="text-center flex flex-col items-center pr-2">
                <div className="w-[225px] -mb-1">
                  <PermanentStamp />
                </div>

                <div
                  className="w-56 pt-1 mt-0.5"
                  style={{ borderTop: '1px dashed #475569' }}
                >
                  <div
                    className="font-cert-sans font-bold uppercase tracking-wide"
                    style={{ color: '#0a1e3c', fontSize: '11px' }}
                  >
                    Authorized Signature
                  </div>
                  <div
                    className="font-cert-display font-bold uppercase mt-0.5"
                    style={{ color: '#0a1e3c', fontSize: '12px' }}
                  >
                    {COMPANY_DETAILS.name}
                  </div>
                  <div
                    className="font-cert-sans font-medium text-slate-600"
                    style={{ fontSize: '10px' }}
                  >
                    (Proprietor / Authorized Person)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
