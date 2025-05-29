// Export the main slice
export { default as announcementsSlice } from './announcementsSlice';
export * from './announcementsSlice';

// Export modal components
export { default as CreateAnnouncementModal } from './modals/CreateAnnouncementModal';
export { default as EditAnnouncementModal } from './modals/EditAnnouncementModal';
export { default as DeleteAnnouncementModal } from './modals/DeleteAnnouncementModal';
export { default as AnnouncementDetailsModal } from './modals/AnnouncementDetailsModal';
export { default as AnnouncementAnalyticsModal } from './modals/AnnouncementAnalyticsModal';

// Export types from API
export type {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AnnouncementReadReceipt,
  AnnouncementAcknowledgment,
  AnnouncementResponse,
  PagedAnnouncementResponse,
  ReadReceiptResponse,
  AcknowledgmentResponse
} from '../../api/services/announcementApi'; 