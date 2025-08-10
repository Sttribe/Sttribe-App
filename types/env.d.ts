declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_RAZORPAY_KEY_ID: string;
      RAZORPAY_SECRET: string;
      WHATSAPP_API_KEY: string;
      RECHARGE_API_KEY: string;
    }
  }
}

export {};