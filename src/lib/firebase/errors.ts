/** Map Firebase Auth errors to user-friendly messages. */
export function getFirebaseAuthErrorMessage(err: unknown): string {
  const code =
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: string }).code === "string"
      ? (err as { code: string }).code
      : "";

  switch (code) {
    case "auth/billing-not-enabled":
      return (
        "Firebase billing is not enabled. Upgrade project driveclear-82af6 to Blaze plan " +
        "(pay as you go) in Firebase Console → Upgrade, OR add a test phone number under " +
        "Authentication → Sign-in method → Phone → Phone numbers for testing."
      );
    case "auth/operation-not-allowed":
      return (
        "Phone login is not enabled in Firebase. Open Firebase Console → Authentication → " +
        "Sign-in method → enable Phone, and upgrade to Blaze plan for SMS OTP."
      );
    case "auth/invalid-phone-number":
      return "Invalid phone number. Use a valid 10-digit Indian mobile number.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Refresh the page and try again.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Check Firebase billing or use a test phone number.";
    default:
      if (err instanceof Error) return err.message;
      return "Failed to send OTP. Please try again.";
  }
}
