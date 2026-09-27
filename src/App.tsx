import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Printer,
  Download,
  FilePlus2,
  Eraser,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FolderKanban,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LayoutTemplate,
} from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  CertificateData,
  CertificateDesignStyle,
  COMPANY_DETAILS,
  PhotoKey,
} from './types/certificate';
import {
  createBlankCertificate,
  deleteCertificateFromStorage,
  generateNextCertificateNumber,
  getSavedCertificates,
  saveCertificateToStorage,
} from './utils/storage';
import { CertificateForm } from './components/CertificateForm';
import { PhotoUploadSection } from './components/PhotoUploadSection';
import { CertificateSheet } from './components/CertificateSheet';
import { SavedCertificatesPanel } from './components/SavedCertificatesPanel';

type ConfirmationType = 'new' | 'clear' | null;

export default function App() {
  const [savedCertificates, setSavedCertificates] = useState<CertificateData[]>(() =>
    getSavedCertificates()
  );
  const [certData, setCertData] = useState<CertificateData>(() => createBlankCertificate());
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof CertificateData, string>>
  >({});
  const [confirmModal, setConfirmModal] = useState<ConfirmationType>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Preview scaling state to preserve exact A4 ratio (794 x 1123) on all screen sizes
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfExportSheetRef = useRef<HTMLDivElement | null>(null);
  const [autoScale, setAutoScale] = useState<number>(0.68);
  const [manualZoomOffset, setManualZoomOffset] = useState<number>(0);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Responsive A4 aspect ratio calculation
  useEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;
      const containerWidth = previewContainerRef.current.clientWidth - 32; // account for padding
      const calculated = Math.min(1, Math.max(0.32, containerWidth / 794));
      setAutoScale(Number(calculated.toFixed(3)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const effectiveScale = Math.min(1.15, Math.max(0.3, autoScale + manualZoomOffset));

  const hasEnteredData = useCallback(() => {
    const hasText =
      certData.consumerName.trim() !== '' ||
      certData.consumerNumber.trim() !== '' ||
      certData.applicationNumber.trim() !== '' ||
      certData.address.trim() !== '' ||
      certData.plantCapacity.trim() !== '' ||
      certData.subDivision.trim() !== '' ||
      certData.otherDetails.trim() !== '';
    const hasPhotos = Object.values(certData.photos).some(Boolean);
    return hasText || hasPhotos;
  }, [certData]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CertificateData, string>> = {};
    if (!certData.certificateNo.trim()) {
      errors.certificateNo = 'Certificate No. is required';
    }
    if (!certData.consumerName.trim()) {
      errors.consumerName = 'Consumer Name is required';
    }
    if (!certData.consumerNumber.trim()) {
      errors.consumerNumber = 'Consumer Number is required';
    }
    if (!certData.applicationNumber.trim()) {
      errors.applicationNumber = 'Application Number is required';
    }
    if (!certData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!certData.plantCapacity.trim()) {
      errors.plantCapacity = 'Plant Capacity is required';
    }
    if (!certData.subDivision.trim()) {
      errors.subDivision = 'Sub-Division is required';
    }
    if (!certData.vendorName.trim()) {
      errors.vendorName = 'Vendor Name is required';
    }
    if (!certData.completionDate.trim()) {
      errors.completionDate = 'Installation / Completion Date is required';
    }
    if (!certData.place.trim()) {
      errors.place = 'Place is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: keyof CertificateData, value: string) => {
    setCertData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePhotoChange = (key: PhotoKey, dataUrl: string | null) => {
    setCertData((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        [key]: dataUrl,
      },
    }));
  };

  const handleGenerateCertNumber = () => {
    const nextNo = generateNextCertificateNumber(2026);
    handleFieldChange('certificateNo', nextNo);
    showToast(`Generated Certificate No.: ${nextNo}`);
  };

  const handleSaveCertificate = () => {
    const isValid = validateForm();
    const result = saveCertificateToStorage(certData);
    setSavedCertificates(result.certificates);

    if (!result.success) {
      showToast(result.error || 'Failed to save certificate.', 'error');
      return;
    }

    if (!isValid) {
      showToast('Saved draft certificate (some fields are still blank).');
    } else {
      showToast(`Certificate ${certData.certificateNo} saved to browser storage.`);
    }
  };

  const handlePrintCertificate = () => {
    // Auto-save if consumer name is present so office worker doesn't lose work
    if (certData.consumerName.trim() !== '') {
      const res = saveCertificateToStorage(certData);
      if (res.success) {
        setSavedCertificates(res.certificates);
      }
    }
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!pdfExportSheetRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
      // Save record automatically if consumer name is entered
      if (certData.consumerName.trim() !== '') {
        const res = saveCertificateToStorage(certData);
        if (res.success) {
          setSavedCertificates(res.certificates);
        }
      }

      const dataUrl = await toJpeg(pdfExportSheetRef.current, {
        quality: 0.96,
        pixelRatio: 2.2,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        skipFonts: true,
        fontEmbedCSS: '',
        cacheBust: false,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      const safeCertNo = (certData.certificateNo || 'Certificate')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_');
      const safeConsumer = certData.consumerName
        ? `_${certData.consumerName.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}`
        : '';

      pdf.save(`PM_Surya_Ghar_${safeCertNo}${safeConsumer}.pdf`);
      showToast('A4 Portrait PDF downloaded successfully.');
    } catch (err) {
      console.error('PDF generation failed, falling back to print dialog:', err);
      showToast('Opening browser Save-as-PDF print dialog...');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const requestNewCertificate = () => {
    if (hasEnteredData()) {
      setConfirmModal('new');
    } else {
      executeNewCertificate();
    }
  };

  const executeNewCertificate = () => {
    const fresh = createBlankCertificate();
    setCertData(fresh);
    setValidationErrors({});
    setConfirmModal(null);
    showToast(`Started new certificate (${fresh.certificateNo}).`);
  };

  const requestClearForm = () => {
    if (hasEnteredData()) {
      setConfirmModal('clear');
    } else {
      executeClearForm();
    }
  };

  const executeClearForm = () => {
    setCertData((prev) => ({
      ...createBlankCertificate(prev.certificateNo),
      id: prev.id,
    }));
    setValidationErrors({});
    setConfirmModal(null);
    showToast('Cleared all form fields and uploaded photos.');
  };

  const handleOpenSavedCertificate = (cert: CertificateData) => {
    setCertData(cert);
    setValidationErrors({});
    showToast(`Loaded Certificate ${cert.certificateNo}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintSavedCertificate = (cert: CertificateData) => {
    setCertData(cert);
    setValidationErrors({});
    setTimeout(() => {
      window.print();
    }, 180);
  };

  const handleDeleteSavedCertificate = (id: string) => {
    const updated = deleteCertificateFromStorage(id);
    setSavedCertificates(updated);
    showToast('Certificate deleted from saved records.');
  };

  const currentDesign: CertificateDesignStyle = certData.designStyle || 'sovereign';

  const handleDesignChange = (style: CertificateDesignStyle) => {
    setCertData((prev) => ({ ...prev, designStyle: style }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f5f9] text-slate-900 relative z-10">
      {/* TOP BAR CONTRACT: 3 Zones (Brand Title, Nav Links, Primary Actions) */}
      <header className="no-print sticky top-0 z-30 bg-[#0a1e3c] text-white border-b border-amber-500/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap truncate"
        >
          PM Surya Ghar Certificate Studio
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#form-section" className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Data Entry
          </a>
          <a href="#photo-section" className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Site Photos
          </a>
          <a href="#preview-section" className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Live A4 Preview
          </a>
          <a href="#saved-section" className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Saved Records ({savedCertificates.length})
          </a>
        </nav>

        {/* Zone 3: 2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSaveCertificate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            Save Record
          </button>
          <button
            type="button"
            onClick={handlePrintCertificate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Certificate
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 max-w-sm bg-[#0a1e3c] text-white px-4 py-3 rounded-lg shadow-lg border border-amber-400/40 flex items-center gap-2.5 text-xs font-medium">
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Confirmation Modal for NEW CERTIFICATE / CLEAR FORM */}
      {confirmModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {confirmModal === 'new'
                    ? 'Start a New Certificate?'
                    : 'Clear All Entered Information?'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {confirmModal === 'new'
                    ? 'Starting a new certificate will reset the current form fields and generate the next Certificate Number. If you have not saved the current certificate, unsaved changes will be lost.'
                    : 'This will clear all entered consumer details and remove uploaded photos from the current form. Are you sure you want to proceed?'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={
                  confirmModal === 'new' ? executeNewCertificate : executeClearForm
                }
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                {confirmModal === 'new' ? 'Yes, New Certificate' : 'Yes, Clear Form'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE CONTENT */}
      <main id="top" className="no-print flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* Executive Command Header */}
        <div
          className="bg-white border border-slate-200/90 rounded-xl p-5 mb-6 shadow-xs"
          style={{ borderTop: '4px solid #0a1e3c' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                PM SURYA GHAR- MUFT BIJULI YOJONA
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-[#0a1e3c] mt-0.5 tracking-tight">
                {COMPANY_DETAILS.name} — Project Completion Certificate
              </h1>
              <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="font-medium">
                  {COMPANY_DETAILS.addressLine1} {COMPANY_DETAILS.addressLine2}{' '}
                  {COMPANY_DETAILS.addressLine3}
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-cert-mono font-semibold text-slate-800">
                  GSTIN: {COMPANY_DETAILS.gstin}
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-cert-mono font-semibold text-slate-800">
                  Contact: {COMPANY_DETAILS.contactNo}
                </span>
              </div>
            </div>

            {/* Required Action Buttons: NEW CERTIFICATE, CLEAR FORM, SAVE, PRINT CERTIFICATE, DOWNLOAD PDF */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={requestNewCertificate}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FilePlus2 className="w-4 h-4 text-[#0a1e3c]" />
                NEW CERTIFICATE
              </button>

              <button
                type="button"
                onClick={requestClearForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Eraser className="w-4 h-4" />
                CLEAR FORM
              </button>

              <button
                type="button"
                onClick={handleSaveCertificate}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="w-4 h-4" />
                SAVE CERTIFICATE
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                DOWNLOAD PDF
              </button>

              <button
                type="button"
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0a1e3c] hover:bg-[#132f5c] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                PRINT CERTIFICATE
              </button>
            </div>
          </div>

          {/* Certificate Design Template Switcher Bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <LayoutTemplate className="w-4 h-4 text-amber-700" />
              <span>Certificate A4 Layout Style:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleDesignChange('sovereign')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currentDesign === 'sovereign'
                    ? 'bg-[#0a1e3c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Sovereign Navy &amp; Gold (New)
              </button>
              <button
                type="button"
                onClick={() => handleDesignChange('executive')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currentDesign === 'executive'
                    ? 'bg-[#0a1e3c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Modern Executive Grid
              </button>
              <button
                type="button"
                onClick={() => handleDesignChange('classic')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currentDesign === 'classic'
                    ? 'bg-[#0a1e3c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Classic Double-Ruled
              </button>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN WORKSPACE: Left = Form & Photos | Right = Live A4 Certificate Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Form + Photo Uploads */}
          <div className="xl:col-span-6 space-y-6">
            <section id="form-section">
              <CertificateForm
                data={certData}
                validationErrors={validationErrors}
                onChange={handleFieldChange}
                onGenerateCertNumber={handleGenerateCertNumber}
              />
            </section>

            <section id="photo-section">
              <PhotoUploadSection
                photos={certData.photos}
                hideEmptyPhotos={certData.hideEmptyPhotos}
                photoFitMode={certData.photoFitMode}
                onPhotoChange={handlePhotoChange}
                onToggleHideEmpty={(hide) =>
                  setCertData((prev) => ({ ...prev, hideEmptyPhotos: hide }))
                }
                onChangeFitMode={(mode) =>
                  setCertData((prev) => ({ ...prev, photoFitMode: mode }))
                }
              />
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Live A4 Portrait Preview */}
          <div id="preview-section" className="xl:col-span-6 xl:sticky xl:top-16">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              {/* Preview Toolbar */}
              <div className="px-4 py-3 bg-[#0a1e3c] text-white flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Live A4 Portrait Preview
                  </span>
                  <span className="text-[11px] text-slate-300 hidden sm:inline">
                    · 210mm × 297mm
                  </span>
                </div>

                {/* Zoom & Print Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setManualZoomOffset((z) => Math.max(-0.25, z - 0.08))}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-cert-mono text-slate-200 px-1 tabular-nums">
                    {Math.round(effectiveScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setManualZoomOffset((z) => Math.min(0.35, z + 0.08))}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {manualZoomOffset !== 0 && (
                    <button
                      type="button"
                      onClick={() => setManualZoomOffset(0)}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                      title="Reset Zoom to Fit"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print A4
                  </button>
                </div>
              </div>

              {/* Scaled A4 Sheet Viewport */}
              <div
                ref={previewContainerRef}
                className="bg-slate-800 p-4 flex justify-center items-start overflow-x-auto"
              >
                <div
                  style={{
                    width: `${Math.round(794 * effectiveScale)}px`,
                    height: `${Math.round(1123 * effectiveScale)}px`,
                    position: 'relative',
                  }}
                  className="shrink-0 transition-all duration-150"
                >
                  <div
                    style={{
                      width: '794px',
                      height: '1123px',
                      transform: `scale(${effectiveScale})`,
                      transformOrigin: 'top left',
                    }}
                    className="shadow-2xl bg-white"
                  >
                    <CertificateSheet data={certData} />
                  </div>
                </div>
              </div>

              {/* Bottom Bar inside Preview Card */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Permanent Stamp:{' '}
                  <strong className="font-semibold text-blue-700">
                    For, Proprietor — M/s. SS Enterprise, Darrang
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isGeneratingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    DOWNLOAD PDF
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0a1e3c] hover:bg-[#132f5c] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    PRINT CERTIFICATE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAVED CERTIFICATES & SEARCH SECTION */}
        <section id="saved-section" className="mt-8">
          <SavedCertificatesPanel
            certificates={savedCertificates}
            activeCertificateId={certData.id}
            onOpenCertificate={handleOpenSavedCertificate}
            onEditCertificate={handleOpenSavedCertificate}
            onPrintCertificate={handlePrintSavedCertificate}
            onDeleteCertificate={handleDeleteSavedCertificate}
            onCreateNew={requestNewCertificate}
          />
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 mt-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong className="font-semibold text-slate-800">{COMPANY_DETAILS.name}</strong> ·{' '}
            {COMPANY_DETAILS.addressLine1} {COMPANY_DETAILS.addressLine2}{' '}
            {COMPANY_DETAILS.addressLine3}
          </div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
            <span>All customer data &amp; photos are stored locally in your browser.</span>
          </div>
        </div>
      </footer>

      {/* Dedicated 1:1 Unscaled Certificate Renderer for Print & High-Res PDF Export */}
      <div
        className="print-only-wrapper fixed left-0 top-0 -z-50 pointer-events-none overflow-hidden w-0 h-0"
        aria-hidden="true"
      >
        <CertificateSheet data={certData} sheetRef={pdfExportSheetRef} />
      </div>
    </div>
  );
}
