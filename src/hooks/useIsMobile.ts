import { useEffect, useState } from 'react';

export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia('(max-width: 768px)').matches;
	});

	useEffect(() => {
		const mql = window.matchMedia('(max-width: 768px)');
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, []);

	return isMobile;
}
