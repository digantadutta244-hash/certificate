import React, { useRef, useState } from 'react';
import { Upload, RefreshCw, Trash2, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CertificatePhotos, PHOTO_FIELDS, PhotoKey } from '../types/certificate';
import { optimizeUploadedImage } from '../utils/imageOptimizer';

interface PhotoUploadSectionProps {
  photos: CertificatePhotos;
  hideEmptyPhotos: boolean;
  photoFitMode: 'cover' | 'contain';
  onPhotoChange: (key: PhotoKey, dataUrl: string | null) => void;
  onToggleHideEmpty: (hide: boolean) => void;
  onChangeFitMode: (mode: 'cover' | 'contain') => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  photos,
  hideEmptyPhotos,
  photoFitMode,
  onPhotoChange,
  onToggleHideEmpty,
  onChangeFitMode,
}) => {
  const fileInputRefs = useRef<Record<PhotoKey, HTMLInputElement | null>>({
    projectComplete: null,
    solarPanel: null,
    earthing: null,
    lightningArrester: null,
    otherAccessories: null,
  });

  const [processingKey, setProcessingKey] = useState<PhotoKey | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (key: PhotoKey, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setProcessingKey(key);
    try {
      const optimizedDataUrl = await optimizeUploadedImage(file, 1100, 0.84);
      onPhotoChange(key, optimizedDataUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not process the selected photo. Please try another image.');
    } finally {
      setProcessingKey(null);
      const inputEl = fileInputRefs.current[key];
      if (inputEl) {
        inputEl.value = '';
      }
    }
  };

  const uploadedCount = Object.values(photos).filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Site &amp; Installation Photographs ({uploadedCount}/5 Uploaded)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Photos are automatically optimized for A4 printing and PDF generation.
          </p>
        </div>

        {/* Display Options for Un-uploaded Boxes & Image Crop */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-md text-xs">
            <button
              type="button"
              onClick={() => onToggleHideEmpty(false)}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                !hideEmptyPhotos
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Show Empty Boxes
            </button>
            <button
              type="button"
              onClick={() => onToggleHideEmpty(true)}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                hideEmptyPhotos
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hide Empty Boxes
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-md text-xs">
            <button
              type="button"
              onClick={() => onChangeFitMode('cover')}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                photoFitMode === 'cover'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fill Box
            </button>
            <button
              type="button"
              onClick={() => onChangeFitMode('contain')}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                photoFitMode === 'contain'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fit Full Image
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {PHOTO_FIELDS.map((field, index) => {
          const currentPhoto = photos[field.key];
          const isProcessing = processingKey === field.key;
          const isPrimary = index === 0;

          return (
            <div
              key={field.key}
              className={`border rounded-lg p-3.5 transition-colors ${
                isPrimary ? 'sm:col-span-2 bg-slate-50/70 border-slate-300' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{field.formLabel}</div>
                  <div className="text-xs text-slate-500">{field.description}</div>
                </div>
                {currentPhoto ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Uploaded
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 shrink-0">Not uploaded</span>
                )}
              </div>

              <input
                ref={(el) => {
                  fileInputRefs.current[field.key] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(field.key, e.target.files?.[0])}
              />

              {currentPhoto ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div
                    className={`relative rounded-md overflow-hidden border border-slate-200 bg-slate-100 shrink-0 ${
                      isPrimary ? 'w-full sm:w-44 h-32' : 'w-full sm:w-32 h-24'
                    }`}
                  >
                    <img
                      src={currentPhoto}
                      alt={field.certLabel}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${
                        photoFitMode === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                    />
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => fileInputRefs.current[field.key]?.click()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      Replace Photo
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => onPhotoChange(field.key, null)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !isProcessing && fileInputRefs.current[field.key]?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!isProcessing && e.dataTransfer.files?.[0]) {
                      handleFileSelect(field.key, e.dataTransfer.files[0]);
                    }
                  }}
                  className="border border-dashed border-slate-300 rounded-md p-4 flex flex-col items-center justify-center text-center hover:border-slate-400 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                      Optimizing image...
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-1.5">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Photo
                      </button>
                      <span className="text-[11px] text-slate-400 mt-1">
                        Click to browse or drop image here
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
