import type { ReactElement } from 'react';
import styles from './YouWon.module.css';

interface VictoryScreenProps {
	onDismiss: () => void;
}

export default function VictoryScreen({ onDismiss }: VictoryScreenProps): ReactElement {
	return (
		<div className={styles.victoryOverlay}>
			<div className={`${styles.browserWindow} ${styles.victoryWindow}`}>
				<header className={styles.header}>
					<div className={styles.title}>congratulations.exe</div>
				</header>
				<div className={styles.victoryContent}>
					<p className={styles.victoryHeading}>YOU WIN!</p>
					<p>Congratulations! You have successfully closed all the popups.</p>
					<p>Your prize: absolutely nothing. But hey, at least the screen is clear now.</p>
					<div className={styles.buttonContainer}>
						<button type="button" onClick={onDismiss}>
							OK
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
