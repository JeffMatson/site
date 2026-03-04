import { useStore } from '@nanostores/react';
import { advancedModeStore, setAdvancedMode, setTheme, themeStore } from '../../stores/themeStore';
import type { ThemeName } from '../../types';

export default function ThemeSelect() {
	const theme = useStore(themeStore);
	const advancedMode = useStore(advancedModeStore);

	const selectValue = advancedMode === 'true' ? 'advanced' : theme;

	const onModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		if (value === 'advanced') {
			setAdvancedMode('true');
		} else {
			setAdvancedMode('false');
			setTheme(value as ThemeName);
		}
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
				value={selectValue}
				onChange={onModeChange}
			>
				<option value="sanity">Sanity Mode</option>
				<option value="dark">Dark Mode</option>
				<option value="light">Light Mode</option>
				<option value="hotdog">Hot Dog Stand</option>
				<option value="advanced">Advanced</option>
			</select>
		</>
	);
}
