// API Configuration
export const API_CONFIG = {
  // Use your computer's local IP address (not localhost)
  // The mobile device needs to access your computer on the network
  BASE_URL: 'http://192.168.1.9:3000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Public API endpoints (no auth required)
export const PUBLIC_API = {
  COURSES: '/public/courses',
  COURSE_DETAIL: (id) => `/public/courses/${id}`,
  BLOG: '/public/blog',
  EVENTS: '/public/events',
  SUCCESS_STORIES: '/public/success-stories',
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: (id) => `/courses/${id}`,
  COURSE_CURRICULUM: (id) => `/courses/${id}/curriculum`,
  COURSE_INSTRUCTORS: (id) => `/courses/${id}/instructors`,
  
  // Enrollments
  ENROLLMENTS: '/enrollments',
  ENROLLMENT_DETAIL: (id) => `/enrollments/${id}`,
  ENROLLMENT_PROGRESS: (id) => `/enrollments/${id}/progress`,
  CHECK_PREREQUISITES: '/enrollments/check-prerequisites',
  
  // Lessons
  LESSON_DETAIL: (id) => `/lessons/${id}`,
  LESSON_COMPLETE: (id) => `/lessons/${id}/complete`,
  
  // Assessments
  ASSESSMENTS: '/assessments',
  ASSESSMENT_DETAIL: (id) => `/assessments/${id}`,
  ASSESSMENT_SUBMIT: (id) => `/assessments/${id}/submit`,
  ASSESSMENT_SUBMISSIONS: (id) => `/assessments/${id}/submissions`,
  
  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_REPORTS: '/attendance/reports',
  ATTENDANCE_OFFLINE: '/mobile/attendance/offline',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_PREFERENCES: '/notifications/preferences',
  MARK_READ: (id) => `/notifications/${id}/read`,
  
  // Messages
  MESSAGES: '/messages',
  MESSAGE_DETAIL: (id) => `/messages/${id}`,
  ANNOUNCEMENTS: '/messages/announcements',
  
  // Certificates
  CERTIFICATES: '/certificates',
  CERTIFICATE_DOWNLOAD: (id) => `/certificates/${id}/download`,
  CERTIFICATE_VERIFY: '/certificates/verify',
  
  // Content
  CONTENT_UPLOAD: '/content/upload',
  CONTENT_FILE: (id) => `/content/files/${id}`,
  CONTENT_URL: (id) => `/content/files/${id}/url`,
  CONTENT_BUNDLE: '/mobile/content/bundle',
  
  // Mobile Sync
  MOBILE_SYNC: '/mobile/sync',
  PUSH_TOKEN: '/mobile/push-token',
  
  // Profile
  PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',
  CHANGE_PASSWORD: '/profile/change-password',
};

export default API_CONFIG;
