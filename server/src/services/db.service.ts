import { dbConnection } from '../config/db';

export class DbService {
  public static getDatabaseStatus() {
    return dbConnection.getStatus();
  }

  public static async checkConnection(): Promise<boolean> {
    return await dbConnection.connect();
  }
}
