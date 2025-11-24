import Constants from 'expo-constants';

// Xác định API base URL linh hoạt theo môi trường
function resolveApiBaseUrl(): string {
  const extra = (Constants.expoConfig?.extra as any) || {};
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL || extra.apiBaseUrl;
  if (fromEnv) return fromEnv.replace(/\/$/, '') + '/api';

  // Mặc định theo nền tảng: emulator/simulator vs thiết bị thật
  // Android emulator: host máy là 10.0.2.2
  // iOS simulator: có thể dùng http://localhost
  // Thiết bị thật: cần IP LAN của máy dev, cập nhật qua EXPO_PUBLIC_API_BASE_URL
  if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '')) {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
}

const API_BASE_URL = resolveApiBaseUrl();

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export async function pingBackend(): Promise<{ reachable: boolean; detail?: string }> {
  try {
    console.log(`[API] Attempting to connect to: ${API_BASE_URL}/health`);
    const res = await fetch(`${API_BASE_URL}/health`);
    const text = await res.text();
    console.log(`[API] Response: HTTP ${res.status} - ${text}`);
    return { reachable: true, detail: `HTTP ${res.status} ${text}` };
  } catch (e: any) {
    console.error(`[API] Connection failed:`, e);
    console.error(`[API] Error details:`, {
      message: e?.message,
      name: e?.name,
      stack: e?.stack,
      cause: e?.cause
    });
    return { reachable: false, detail: String(e?.message || e) };
  }
}

export interface TranslationHistory {
  _id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translationMethod: 'voice' | 'manual';
  timestamp: string;
  userId: string;
}

export interface SaveTranslationRequest {
  originalText: string;
  translatedText: string;
  sourceLanguage?: string;
  targetLanguage: string;
  translationMethod: 'voice' | 'manual';
  userId?: string;
}

export interface TranslationResponse {
  success: boolean;
  message: string;
  data: TranslationHistory;
}

export interface TranslationListResponse {
  success: boolean;
  data: TranslationHistory[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Lưu lịch sử dịch
export async function saveTranslation(translation: SaveTranslationRequest): Promise<TranslationResponse> {
  try {
    console.log('Saving translation to:', `${API_BASE_URL}/translations`);
    const response = await fetch(`${API_BASE_URL}/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(translation),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving translation:', error);
    // Nếu không thể kết nối đến backend, không throw error để app vẫn hoạt động
    if (error.message.includes('Network request failed')) {
      console.warn('Backend not available, translation not saved to history');
      return { success: false, message: 'Backend not available', data: null as any };
    }
    throw error;
  }
}

// Lấy lịch sử dịch
export async function getTranslationHistory(
  userId: string = 'anonymous',
  limit: number = 50,
  page: number = 1
): Promise<TranslationListResponse> {
  try {
    console.log('Fetching translation history from:', `${API_BASE_URL}/translations`);
    const response = await fetch(
      `${API_BASE_URL}/translations?userId=${userId}&limit=${limit}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching translation history:', error);
    
    // If backend is not available, return empty history instead of crashing
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      console.warn('Backend not available, returning empty history');
      return {
        success: false,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit
        }
      };
    }
    
    throw error;
  }
}

// Xóa một bản dịch
export async function deleteTranslation(translationId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/${translationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting translation:', error);
    throw error;
  }
}

// Xóa tất cả lịch sử của user
export async function deleteUserHistory(userId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/user/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting user history:', error);
    throw error;
  }
}
