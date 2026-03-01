import { useStore } from '@nanostores/react';
import { addAnnoyBox, annoyBoxStore } from '../stores/annoyBoxStore';
import { AnnoyBox, generateAnnoyBoxProps } from './AnnoyBox';

export default function YouWon(props) {
	const wrapperStyles = props.wrapperStyles ? props.wrapperStyles : {};

	const annoyBoxes = useStore(annoyBoxStore);

	const createAnnoyBox = (isConfirmation = false) => {
		const annoyBoxProps = generateAnnoyBoxProps({
			isConfirmation: isConfirmation,
		});

		addAnnoyBox(annoyBoxProps.id, annoyBoxProps);
	};

	return (
		<div className="sanityModeHidden" style={wrapperStyles}>
			<button type="button" onClick={() => createAnnoyBox(true)} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%' }}>
				<img src="/images/you-won.svg" alt="ugly fake you won popup ad banner" style={{ width: '100%', height: 'auto' }} />
			</button>

			{Object.keys(annoyBoxes).map((annoyBoxId) => {
				const annoyBox = annoyBoxes[annoyBoxId];

				return (
					<AnnoyBox.Container
						key={annoyBox.key}
						id={annoyBox.id}
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
		</div>
	);
}
