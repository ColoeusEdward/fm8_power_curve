import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
import { conf } from "../enum";

export const configAtom = atomWithStorage<typeof conf>('config', {ip:'127.0.0.1',port:8000})
