export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      PORT: string;
      NODE_ENV: string;

      DATABASE_URL: string;

      JWT_SECRET: string;

      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_SECURE: string;
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
      BOOSTER_DAEMAIL_FROMILY_COST: string;
    }
  }
}
