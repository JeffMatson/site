import MobileGame from "./MobileGame";
import HotSingles from "./HotSingles";
import STD from "./STD";
import SimpleTrick from "./SimpleTrick";
import type { ReactElement } from "react";

export interface CrappyAd {
    title: string,
    content: () => ReactElement,
    buttons: {
        title: string,
        action?: () => void
    }[]
}

const crappyAds: CrappyAd[] = [
    HotSingles, STD, SimpleTrick, MobileGame
];

export default crappyAds;