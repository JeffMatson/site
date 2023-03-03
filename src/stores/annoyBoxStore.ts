import { map } from 'nanostores';
import type { AnnoyBoxProps } from '../components/AnnoyBox';

interface AnnoyBoxStore {
    [key: string]: AnnoyBoxProps
}

export const annoyBoxStore = map<AnnoyBoxStore>({});

export function addAnnoyBox(id: string, annoyBox: AnnoyBoxProps) {
    annoyBoxStore.setKey(id, annoyBox)
}

export function removeAnnoyBox(annoyBoxId: string) {
    const currentBoxes = annoyBoxStore.get();

    if ( annoyBoxId in currentBoxes ) {
        delete currentBoxes[annoyBoxId];
    }
    
    annoyBoxStore.set(currentBoxes);
}

export function removeAllAnnoyBoxes() {
    annoyBoxStore.set({})
}
