import type { ReactElement } from 'react';
import HotSingles from './HotSingles';
import MobileGame from './MobileGame';
import SimpleTrick from './SimpleTrick';
import STD from './STD';

export interface CrappyAd {
	title: string;
	content: () => ReactElement;
	buttons: {
		title: string;
		action?: () => void;
	}[];
}

const crappyAds: CrappyAd[] = [HotSingles, STD, SimpleTrick, MobileGame];

export default crappyAds;
