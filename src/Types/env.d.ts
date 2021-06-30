declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string;
    SECRET: string;
  }
}

declare namespace Express {
  export interface Request {
    user?: any;
  }
}
