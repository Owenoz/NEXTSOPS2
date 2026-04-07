import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG, ENDPOINTS } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let accessToken = null;
let refreshToken = null;

export const setTokens = async (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  
  if (access) {
    await SecureStore.setItemAsync('accessToken', access);
  }
  if (refresh) {
    await SecureStore.setItemAsync('refreshToken', refresh);
  }
};

export const getAccessToken = async () => {
  if (!accessToken) {
    accessToken = await SecureStore.getItemAsync('accessToken');
  }
  return accessToken;
};

export const getRefreshToken = async () => {
  if (!refreshToken) {
    refreshToken = await SecureStore.getItemAsync('refreshToken');
  }
  return refreshToken;
};

export const clearTokens = async () => {
  accessToken = null;
  refreshToken = null;
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = await getRefreshToken();
        if (!refresh) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${ENDPOINTS.REFRESH}`,
          { refreshToken: refresh }
        );

        const { token: newAccessToken } = response.data.data;
        await setTokens(newAccessToken, refresh);
        
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        // Navigate to login (handled by auth context)
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Network status check
export const checkNetworkStatus = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

// API Methods
export const apiService = {
  // Auth
  login: async (email, password) => {
    const response = await api.post(ENDPOINTS.LOGIN, { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post(ENDPOINTS.LOGOUT);
    await clearTokens();
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post(ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Courses
  getCourses: async (params = {}) => {
    const response = await api.get(ENDPOINTS.COURSES, { params });
    return response.data;
  },

  getCourseDetail: async (id) => {
    const response = await api.get(ENDPOINTS.COURSE_DETAIL(id));
    return response.data;
  },

  getCourseCurriculum: async (id) => {
    const response = await api.get(ENDPOINTS.COURSE_CURRICULUM(id));
    return response.data;
  },

  // Enrollments - Students can only see their own enrollments
  getEnrollments: async (params = {}) => {
    // The backend automatically filters by authenticated student
    const response = await api.get(ENDPOINTS.ENROLLMENTS, { params });
    return response.data;
  },

  getMyEnrollments: async (params = {}) => {
    // Explicitly get current student's enrollments
    const response = await api.get(ENDPOINTS.ENROLLMENTS, { params });
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(ENDPOINTS.ENROLLMENTS, { courseId });
    return response.data;
  },

  getEnrollmentProgress: async (id) => {
    const response = await api.get(ENDPOINTS.ENROLLMENT_PROGRESS(id));
    return response.data;
  },

  checkPrerequisites: async (courseId) => {
    const response = await api.post(ENDPOINTS.CHECK_PREREQUISITES, { courseId });
    return response.data;
  },

  // Lessons
  getLessonDetail: async (id) => {
    const response = await api.get(ENDPOINTS.LESSON_DETAIL(id));
    return response.data;
  },

  completeLesson: async (id, enrollmentId) => {
    const response = await api.post(ENDPOINTS.LESSON_COMPLETE(id), { enrollmentId });
    return response.data;
  },

  // Assessments
  getAssessments: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ASSESSMENTS, { params });
    return response.data;
  },

  getAssessmentDetail: async (id) => {
    const response = await api.get(ENDPOINTS.ASSESSMENT_DETAIL(id));
    return response.data;
  },

  submitAssessment: async (id, answers) => {
    const response = await api.post(ENDPOINTS.ASSESSMENT_SUBMIT(id), { answers });
    return response.data;
  },

  getAssessmentSubmissions: async (id) => {
    const response = await api.get(ENDPOINTS.ASSESSMENT_SUBMISSIONS(id));
    return response.data;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS, { params });
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.patch(ENDPOINTS.MARK_READ(id));
    return response.data;
  },

  updateNotificationPreferences: async (preferences) => {
    const response = await api.post(ENDPOINTS.NOTIFICATION_PREFERENCES, preferences);
    return response.data;
  },

  // Messages
  getMessages: async (params = {}) => {
    const response = await api.get(ENDPOINTS.MESSAGES, { params });
    return response.data;
  },

  sendMessage: async (data) => {
    const response = await api.post(ENDPOINTS.MESSAGES, data);
    return response.data;
  },

  getAnnouncements: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ANNOUNCEMENTS, { params });
    return response.data;
  },

  // Certificates
  getCertificates: async () => {
    const response = await api.get(ENDPOINTS.CERTIFICATES);
    return response.data;
  },

  downloadCertificate: async (id) => {
    const response = await api.post(ENDPOINTS.CERTIFICATE_DOWNLOAD(id));
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get(ENDPOINTS.PROFILE);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put(ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post(ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Mobile Sync
  syncOfflineData: async (data) => {
    const response = await api.post(ENDPOINTS.MOBILE_SYNC, data);
    return response.data;
  },

  registerPushToken: async (token) => {
    const response = await api.post(ENDPOINTS.PUSH_TOKEN, { token });
    return response.data;
  },

  // AI Tools
  generateQuiz: async (topic, difficulty, questionCount) => {
    const response = await api.post('/ai/quiz', {
      topic,
      difficulty,
      question_count: questionCount,
    });
    return response.data;
  },

  translateText: async (text, targetLanguage) => {
    const response = await api.post('/ai/translate', {
      text,
      target_language: targetLanguage,
    });
    return response.data;
  },

  textToSpeech: async (text, language = 'en') => {
    const response = await api.post('/ai/text-to-speech', {
      text,
      language,
      store: false,
    });
    return response.data;
  },

  getAIUsage: async () => {
    const response = await api.get('/ai/usage');
    return response.data;
  },
};

export default api;
