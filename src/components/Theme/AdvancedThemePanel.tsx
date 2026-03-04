import { useStore } from '@nanostores/react';
import {
	advancedModeStore,
	advancedOverridesStore,
	removeAdvancedOverride,
	resetAdvancedOverrides,
	setAdvancedOverride,
	setTheme,
	themeStore,
} from '../../stores/themeStore';
import type { ThemeTokenKey } from '../../styles/tokens';
import { customizableTokenGroups, fontOptions, themeNames, themes } from '../../styles/tokens';
import type { ThemeName } from '../../types';
import styles from './AdvancedThemePanel.module.css';

export default function AdvancedThemePanel() {
	const advancedMode = useStore(advancedModeStore);
	const theme = useStore(themeStore);
	const overridesJson = useStore(advancedOverridesStore);

	if (advancedMode !== 'true') return null;

	let overrides: Partial<Record<ThemeTokenKey, string>>;
	try {
		overrides = JSON.parse(overridesJson || '{}');
	} catch {
		overrides = {};
	}

	const baseTokens = themes[(theme as ThemeName) in themes ? (theme as ThemeName) : 'dark'];

	const getEffectiveValue = (key: ThemeTokenKey): string => {
		return overrides[key] ?? baseTokens[key];
	};

	const hasOverride = (key: ThemeTokenKey): boolean => {
		return key in overrides;
	};

	return (
		<div className={styles.panel}>
			<div className={styles.header}>
				<label className={styles.baseLabel}>
					Base:
					<select
						className={styles.baseSelect}
						value={theme}
						onChange={(e) => setTheme(e.target.value as ThemeName)}
					>
						{themeNames.map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</select>
				</label>
				<button type="button" className={styles.button} onClick={() => resetAdvancedOverrides()}>
					Reset All
				</button>
			</div>

			{customizableTokenGroups.map((group) => (
				<fieldset key={group.id} className={styles.group}>
					<legend className={styles.groupLegend}>{group.label}</legend>
					<div className={styles.tokenGrid}>
						{group.tokens.map((token) => (
							<div key={token.key} className={styles.tokenRow}>
								<span className={styles.tokenLabel}>{token.label}</span>
								{group.type === 'color' ? (
									<input
										type="color"
										className={styles.colorInput}
										value={getEffectiveValue(token.key)}
										onChange={(e) => setAdvancedOverride(token.key, e.target.value)}
										title={token.label}
									/>
								) : (
									<select
										className={styles.fontSelect}
										value={getEffectiveValue(token.key)}
										onChange={(e) => setAdvancedOverride(token.key, e.target.value)}
									>
										{fontOptions.map((font) => (
											<option key={font.value} value={font.value}>
												{font.label}
											</option>
										))}
									</select>
								)}
								<button
									type="button"
									className={`${styles.resetTokenButton} ${hasOverride(token.key) ? styles.resetTokenButtonVisible : ''}`}
									onClick={() => removeAdvancedOverride(token.key)}
									title="Reset to default"
									aria-label={`Reset ${token.label}`}
									disabled={!hasOverride(token.key)}
								>
									&#8634;
								</button>
							</div>
						))}
					</div>
				</fieldset>
			))}
		</div>
	);
}
