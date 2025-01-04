import type { ILogger } from "../entity/interface";
import logger from "../entity/winston";

export class Logger implements ILogger {
  info(message: string) {
    logger.info(message);
  }

  warn(message: string) {
    logger.warn(message);
  }

  error(message: string) {
    logger.error(message);
  }
}
