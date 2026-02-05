import pino from "pino";

const isServer = typeof window === "undefined";

const browserStream: pino.DestinationStream = {
  write(msg: string) {
    try {
      const obj = JSON.parse(msg);
      const level = obj.level;
      if (level === 50) {
        console.error(obj.msg ?? "", obj);
      } else if (level === 40) {
        console.warn(obj.msg ?? "", obj);
      } else {
        console.log(obj.msg ?? "", obj);
      }
    } catch {
      console.log(msg);
    }
  },
};

export const logger = pino(
  {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
  isServer ? process.stdout : browserStream,
);
