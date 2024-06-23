import type { UserInfo } from "firebase/auth";
import { writable } from "svelte/store";

export type StorageItem = {
    id: string;
    name: string;
    desc: string;
};

export type Items = {
    word: StorageItem[];
    sentence: StorageItem[];
};

type userId = string | null;

export const authStore = writable({ loggedIn: false, user: null as UserInfo | null, userId: null as userId});
export const items = writable<Items[]>([{ word: [], sentence: [] }]);