import { CoreService } from "./core.service";
import { StorageService } from "./storage.service";

export const storageService = new StorageService();
export const coreService = new CoreService(storageService);
