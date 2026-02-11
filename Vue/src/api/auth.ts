import { ref, watch } from 'vue';

// Initialize tokens from localStorage if they exist
const STORAGE_KEY_ACCESS = 'contacts_access_token';
const STORAGE_KEY_REFRESH = 'contacts_refresh_token';

export const access = ref<string | null>(localStorage.getItem(STORAGE_KEY_ACCESS));
export const refresh = ref<string | null>(localStorage.getItem(STORAGE_KEY_REFRESH));

// Watch for changes and sync to localStorage
// This ensures that even if a refresh happens in an interceptor, 
// the new tokens persist across page reloads.
watch(access, (newToken) => {
  if (newToken) localStorage.setItem(STORAGE_KEY_ACCESS, newToken);
  else localStorage.removeItem(STORAGE_KEY_ACCESS);
});

watch(refresh, (newToken) => {
  if (newToken) localStorage.setItem(STORAGE_KEY_REFRESH, newToken);
  else localStorage.removeItem(STORAGE_KEY_REFRESH);
});

/**
 * Utility to wipe state on logout or expired refresh sessions
 */
export function clearTokens() {
  access.value = null;
  refresh.value = null;
}

export function setTokens(accessToken: string, refreshToken: string) {
  access.value = accessToken;
  refresh.value = refreshToken;
}