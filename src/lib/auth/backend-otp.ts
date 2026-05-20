import { apiRequest } from "@/lib/api/client";
import { setTokens } from "@/lib/auth/token";

interface OtpSendResponse {
  expires_in_seconds: number;
  dev_otp?: string;
  dev_note?: string;
}

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

export async function sendBackendOtp(
  phone: string,
  name: string,
): Promise<OtpSendResponse> {
  return apiRequest<OtpSendResponse>("post", "/auth/otp/send/", {
    phone_number: phone,
    name,
  });
}

export async function verifyBackendOtp(
  phone: string,
  otp: string,
  name: string,
): Promise<LoginResponse> {
  const deviceId =
    localStorage.getItem("device_id") ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("device_id", id);
      return id;
    })();

  const data = await apiRequest<LoginResponse>("post", "/auth/otp/verify/", {
    phone_number: phone,
    otp,
    name,
    device_id: deviceId,
    device_platform: "web",
  });

  setTokens(data.access, data.refresh);
  return data;
}
