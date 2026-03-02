import { useStore } from '@nanostores/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { addAnnoyBox, annoyBoxStore, removeAllAnnoyBoxes } from '../stores/annoyBoxStore';
import { AnnoyBox, generateAnnoyBoxProps } from './AnnoyBox';
import VictoryScreen from './VictoryScreen';

import styles from './YouWon.module.css';

interface YouWonProps {
	wrapperStyles?: React.CSSProperties;
}

export default function YouWon({ wrapperStyles = {} }: YouWonProps) {
	const annoyBoxes = useStore(annoyBoxStore);
	const isMobile = useIsMobile();
	const [showVictory, setShowVictory] = useState(false);
	const prevCountRef = useRef(0);

	const boxIds = Object.keys(annoyBoxes);
	const boxCount = boxIds.length;

	useEffect(() => {
		if (prevCountRef.current > 0 && boxCount === 0) {
			setShowVictory(true);
		}
		prevCountRef.current = boxCount;
	}, [boxCount]);

	const createAnnoyBox = (isConfirmation = false) => {
		const annoyBoxProps = generateAnnoyBoxProps({
			isConfirmation: isConfirmation,
		});
		addAnnoyBox(annoyBoxProps.id, annoyBoxProps);
	};

	const handleDismissVictory = () => {
		setShowVictory(false);
	};

	const bannerButton = (
		<button
			type="button"
			onClick={() => createAnnoyBox(true)}
			style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%' }}
		>
			<img
				src="/images/you-won.svg"
				alt="ugly fake you won popup ad banner"
				style={{ width: '100%', height: 'auto' }}
			/>
		</button>
	);

	const closeAllButton = boxCount > 0 && (
		<button type="button" className={styles.closeAllButton} onClick={() => removeAllAnnoyBoxes()}>
			Close All ({boxCount})
		</button>
	);

	// --- MOBILE PATH: full-screen sequential mode ---
	if (isMobile && boxCount > 0) {
		const currentBoxId = boxIds[0];
		const currentBox = annoyBoxes[currentBoxId];
		const waitingCount = boxCount - 1;

		return (
			<div className="sanityModeHidden" style={wrapperStyles}>
				{bannerButton}

				<div className={styles.mobileOverlay}>
					{waitingCount > 0 && (
						<div className={styles.mobileBadge}>
							{waitingCount} more popup{waitingCount !== 1 ? 's' : ''} waiting...
						</div>
					)}

					<div className={`${styles.browserWindow} ${styles.mobileAnnoyBox}`}>
						<div className="wrapper">
							<AnnoyBox.Header>{currentBox.title}</AnnoyBox.Header>
							<AnnoyBox.Content>{currentBox.content()}</AnnoyBox.Content>
							<AnnoyBox.ButtonContainer>
								{currentBox.buttons.map((annoyBoxButton) => (
									<AnnoyBox.Button
										key={annoyBoxButton.title}
										title={annoyBoxButton.title}
										action={annoyBoxButton.action}
										annoyBoxId={currentBox.id}
									/>
								))}
							</AnnoyBox.ButtonContainer>
						</div>
					</div>

					{closeAllButton}
				</div>
			</div>
		);
	}

	// --- DESKTOP PATH (+ mobile with no active boxes) ---
	return (
		<div className="sanityModeHidden" style={wrapperStyles}>
			{bannerButton}

			{boxIds.map((annoyBoxId) => {
				const annoyBox = annoyBoxes[annoyBoxId];

				return (
					<AnnoyBox.Container
						key={annoyBox.key}
						isConfirmation={annoyBox.isConfirmation}
						position={annoyBox.position}
					>
						<AnnoyBox.Header>{annoyBox.title}</AnnoyBox.Header>
						<AnnoyBox.Content>{annoyBox.content()}</AnnoyBox.Content>
						<AnnoyBox.ButtonContainer>
							{annoyBox.buttons.map((annoyBoxButton) => (
								<AnnoyBox.Button
									key={annoyBoxButton.title}
									title={annoyBoxButton.title}
									action={annoyBoxButton.action}
									annoyBoxId={annoyBox.id}
								/>
							))}
						</AnnoyBox.ButtonContainer>
					</AnnoyBox.Container>
				);
			})}

			{closeAllButton}

			{showVictory && <VictoryScreen onDismiss={handleDismissVictory} />}
		</div>
	);
}
