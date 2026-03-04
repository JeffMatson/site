import { useStore } from '@nanostores/react';
import { type PaletteStoreValue, setPalette, setTheme, themeStore } from '../../stores/themeStore';
import type { ThemeName } from '../../types';

export default function ThemeSelect() {
	const theme = useStore(themeStore);

	const onModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTheme(e.target.value as ThemeName);
	};

	const _onPaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPalette(e.target.value as PaletteStoreValue);
	};

	return (
		<>
			<label
				className="label"
				htmlFor="themeSelector"
				style={{
					position: 'absolute',
					width: '1px',
					height: '1px',
					overflow: 'hidden',
					clip: 'rect(0, 0, 0, 0)',
					whiteSpace: 'nowrap',
				}}
			>
				Theme select
			</label>
			<select
				className="select"
				name="theme"
				id="themeSelector"
				aria-label="Theme select"
				value={theme}
				onChange={onModeChange}
			>
				<option value="sanity">Sanity Mode</option>
				<option value="dark">Dark Mode</option>
				<option value="light">Light Mode</option>
				<option value="hotdog">Hot Dog Stand</option>
				<option value="dracula">Dracula</option>
			</select>
		</>
	);
}
