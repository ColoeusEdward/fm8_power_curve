import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
import { conf } from "../enum";

export const configAtom = atomWithStorage<typeof conf>('config', {ip:'127.0.0.1',port:8000})

export const maxDataAtom = atom<maxDataItem>({ power: { max: 0, rpm: 0 }, torque: { max: 0, rpm: 0 } })

export const realTimeDataAtom = atom<TelemetryDataItem>()

export const hideBtnShowAtom = atomWithStorage('hideBtnShowAtom',false)

export const windowSizeAtom = atom<Window>()