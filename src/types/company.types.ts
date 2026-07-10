export interface CompanyInquiryResponse {
  companyId?: string
  registrationNo?: string
  title?: string
  registrationDate?: string
  capital?: number
  address?: string
  postalCode?: string
  taxNumber?: string
  lat?: number
  lng?: number
  website?: string
  tel?: string
  fax?: string
  email?: string
  status?: string
  edareKol?: string
  vahedSabti?: string
  lastUpdate?: string
  registrationTypeId?: number
  registrationTypeTitle?: string
  persianRegistrationDate?: string
  knowledgeBasedState?: string
  knowledgeBasedCategory?: string
  knowledgeBasedConfirmationDate?: string
}

/**
 * Known `knowledgeBasedType` values observed so far:
 * - `"STARTUP"`
 *
 * Known `companyType` values observed so far:
 * - `"PRIVATE_JOINT_STOCK"`
 */
export interface CompanyMetadata {
  knowledgeBased?: boolean
  knowledgeBasedType?: string
  companyType?: string
  mail?: string
  website?: string
  contactName?: string
  contactPhone?: string
  address?: string
  fieldOfActivity?: string
  establishmentDate?: string
  initialCapital?: number
  currentCapital?: number
  inquiryResponse?: CompanyInquiryResponse
}

export interface Company {
  id?: string
  name?: string
  previewName?: string
  registrationNumber?: string
  nationalId?: string
  metadata?: CompanyMetadata
  logoKey?: string
  activeTab?: string
}
