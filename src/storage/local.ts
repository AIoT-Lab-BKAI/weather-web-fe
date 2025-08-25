import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";
import { LocalStorage } from "@/lib/local-storage";

export const localAccessToken = new LocalStorage<string>(LS_KEY_ACCESS_TOKEN, null);
