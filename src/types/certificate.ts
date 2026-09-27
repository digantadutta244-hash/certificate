export interface CertificatePhotos {
  projectComplete: string | null;
  solarPanel: string | null;
  earthing: string | null;
  lightningArrester: string | null;
  otherAccessories: string | null;
}

export type PhotoKey = keyof CertificatePhotos;

export type CertificateDesignStyle = 'sovereign' | 'executive' | 'classic';

export interface CertificateData {
  id: string;
  certificateNo: string;
  consumerName: string;
  consumerNumber: string;
  applicationNumber: string;
  address: string;
  plantCapacity: string;
  subDivision: string;
  vendorName: string;
  completionDate: string;
  place: string;
  otherDetails: string;
  photos: CertificatePhotos;
  hideEmptyPhotos: boolean;
  photoFitMode: 'cover' | 'contain';
  designStyle?: CertificateDesignStyle;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  certificateNo: string;
  consumerName: string;
  consumerNumber: string;
  applicationNumber: string;
}

export const COMPANY_DETAILS = {
  name: 'M/S S.S ENTERPRISE',
  addressLine1: 'THALTHALI, :: PO- KOUPATI,',
  addressLine2: ':: DIST - DARRANG',
  addressLine3: '(ASSAM) - 784115',
  email: 'S.S.ENTERPRISE784113@GMAIL.COM',
  gstin: '18AXVPA0248C1ZO',
  contactNo: '7637021681',
} as const;

export const PHOTO_FIELDS: {
  key: PhotoKey;
  formLabel: string;
  certLabel: string;
  description: string;
}[] = [
  {
    key: 'projectComplete',
    formLabel: '1. Project Complete Photo',
    certLabel: 'Project Complete Photo',
    description: 'Main site photo with consumer / full solar rooftop installation',
  },
  {
    key: 'solarPanel',
    formLabel: '2. Solar Panel Photo',
    certLabel: 'Solar Panel Installation',
    description: 'Installed PV modules and mounting structure on roof',
  },
  {
    key: 'earthing',
    formLabel: '3. Earthing Photo',
    certLabel: 'Earthing',
    description: 'Earthing pit and earth strip connection photograph',
  },
  {
    key: 'lightningArrester',
    formLabel: '4. Lightning Arrester Photo',
    certLabel: 'Lightning Arrester',
    description: 'Installed lightning protection rod / arrester on rooftop',
  },
  {
    key: 'otherAccessories',
    formLabel: '5. Other Accessories Photo',
    certLabel: 'Other Accessories',
    description: 'Inverter, ACDB/DCDB, net meter, and safety signage',
  },
];
