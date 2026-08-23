export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  // If no token supplied, reject immediately
  if (!token || typeof token !== "string" || !token.trim()) {
    return { success: false, error: "Verification token is required. Please complete Turnstile verification." };
  }

  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAAEZCWPKxjnaKjdQ0CmbH2eS6XbM";

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const data = await res.json();

    if (data && data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: "Verification failed. Please try again."
    };
  } catch {
    return {
      success: false,
      error: "Verification service temporary unavailable. Please try again."
    };
  }
}
