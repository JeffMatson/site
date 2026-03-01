import CrappyAds, { type CrappyAd } from '@components/CrappyAds';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import boldStrategy from '../images/bold-strategy.gif';
import { addAnnoyBox, removeAllAnnoyBoxes, removeAnnoyBox } from '../stores/annoyBoxStore';
import { generateString, getViewportSize } from '../utils';

import styles from './YouWon.module.css';

interface PositionCoordinates {
	x: number;
	y: number;
}

interface AnnoyBox {
	Container: FunctionComponent<{
		isConfirmation: boolean;
		position: PositionCoordinates;
		children: ReactNode;
	}>;
	Content: FunctionComponent<{
		children: ReactNode;
	}>;
	Header: FunctionComponent<{
		children: ReactNode;
	}>;
	ButtonContainer: FunctionComponent<{ children: ReactNode }>;
	Button: FunctionComponent<{
		action: (id: string) => void;
		annoyBoxId: string;
		title: string;
	}>;
}

interface AnnoyBoxButton {
	title: string;
	action: () => void;
}

export interface AnnoyBoxProps extends CrappyAd {
	key: string;
	id: string;
	isConfirmation: boolean;
	title: string;
	content: () => ReactElement;
	position: PositionCoordinates;
	buttons: AnnoyBoxButton[];
}

const AnnoyBox: AnnoyBox = {
	Container: ({ isConfirmation, position: { x, y }, children }): ReactElement => {
		const classNames = `${styles.browserWindow} ${isConfirmation ? styles.annoyBoxConfirm : styles.annoyBox}`;
		const positions = !isConfirmation ? { top: y, left: x } : {};

		return (
			<div className={classNames} style={positions}>
				<div className="wrapper">{children}</div>
			</div>
		);
	},
	Content: ({ children }) => {
		return <div>{children}</div>;
	},
	Header: (props) => {
		return (
			<header className={styles.header}>
				<div className={styles.title}>{props.children}</div>
			</header>
		);
	},
	ButtonContainer: ({ children }) => {
		return <div className={styles.buttonContainer}>{children}</div>;
	},
	Button: ({ action, annoyBoxId, title }) => {
		let buttonAction = action;

		if (action === undefined) {
			buttonAction = (id) => forkAnnoyBox(id);
		}

		return (
			<button type="button" onClick={() => buttonAction(annoyBoxId)}>
				{title}
			</button>
		);
	},
};

const getAnnoyBoxPosition = (): PositionCoordinates => {
	const viewportSize = getViewportSize();

	const x = Math.random() * (viewportSize.width - 250) + 1;
	const y = Math.random() * (viewportSize.height - 250) + 1;

	return { x, y };
};

const getCrappyAd = (): CrappyAd => {
	return CrappyAds[Math.floor(Math.random() * CrappyAds.length)];
};

const forkAnnoyBox = (toFork: string) => {
	const newAnnoyBox1 = generateAnnoyBoxProps();
	const newAnnoyBox2 = generateAnnoyBoxProps();
	addAnnoyBox(newAnnoyBox1.id, newAnnoyBox1);
	addAnnoyBox(newAnnoyBox2.id, newAnnoyBox2);
	removeAnnoyBox(toFork);
};

const generateAnnoyBoxProps = (props = { isConfirmation: false }) => {
	if (props.isConfirmation) {
		const annoyBoxProps: AnnoyBoxProps = {
			key: 'confirm',
			id: 'confirm',
			title: 'Tempting, eh?',
			content: () => (
				<>
					<p>Are you sure you really want to go down this road?</p>
					<img src={boldStrategy} alt="Bold strategy meme" />
				</>
			),
			isConfirmation: true,
			position: getAnnoyBoxPosition(),
			buttons: [
				{
					title: 'YOLO',
					action: () => forkAnnoyBox('confirm'),
				},
				{
					title: 'Nevermind',
					action: () => removeAllAnnoyBoxes(),
				},
			],
		};

		return annoyBoxProps;
	}

	const annoyBoxProps = getCrappyAd() as AnnoyBoxProps;

	annoyBoxProps.isConfirmation = false;
	annoyBoxProps.position = getAnnoyBoxPosition();
	annoyBoxProps.id = generateString('annoyBox');
	annoyBoxProps.key = annoyBoxProps.id;

	return annoyBoxProps;
};

export { AnnoyBox, getCrappyAd, generateAnnoyBoxProps };
