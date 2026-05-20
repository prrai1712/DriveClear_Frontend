import { apiRequest } from "@/lib/api/client";
import { setTokens } from "@/lib/auth/token";

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    uuid: string;
    name: string;
    phone_number: string;
    is_phone_verified: boolean;
  };
}

export async function exchangeFirebaseToken(
  idToken: string,
  name: string,
): Promise<LoginResponse> {
  const deviceId =
    typeof window !== "undefined"
      ? localStorage.getItem("device_id") ||
        (() => {
          const id = crypto.randomUUID();
          localStorage.setItem("device_id", id);
          return id;
        })()
      : "";

  const data = await apiRequest<LoginResponse>("post", "/auth/firebase/verify/", {
    id_token: idToken,
    name,
    device_id: deviceId,
    device_platform: "web",
  });

  setTokens(data.access, data.refresh);
  return data;
}
