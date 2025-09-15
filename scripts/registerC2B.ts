import { registerC2BUrls } from "@/lib/mpesaUtils";

(async () => {
  try {
    await registerC2BUrls();
  } catch (err) {
    if (err instanceof Error) {
      console.error("Registration failed:", err.message);
    } else {
      console.error("Registration failed:", err);
    }
  }
})();
