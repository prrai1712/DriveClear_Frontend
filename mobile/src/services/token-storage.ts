/**
 * Access token storage for the mobile app.
 * Uses expo-secure-store when the Expo runtime is available; falls back to in-memory for dev/IDE.
 */

let memoryToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  try {
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync("access_token");
  } catch {
    return memoryToken;
  }
}

export async function setAccessToken(token: string): Promise<void> {
  memoryToken = token;
  try {
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync("access_token", token);
  } catch {
    /* in-memory only until Expo app is running */
  }
}

export async function clearAccessToken(): Promise<void> {
  memoryToken = null;
  try {
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync("access_token");
  } catch {
    /* in-memory only */
  }
}
