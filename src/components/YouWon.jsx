import youWon from '/images/you-won.svg';
import { AnnoyBox, generateAnnoyBoxProps } from './AnnoyBox';
import { useStore } from '@nanostores/react';
import { annoyBoxStore, addAnnoyBox } from '../stores/annoyBoxStore';

export default function YouWon(props) {

    const wrapperStyles = props.wrapperStyles ? props.wrapperStyles : {};

    const annoyBoxes = useStore(annoyBoxStore);

    const createAnnoyBox = (isConfirmation = false) => {
        const annoyBoxProps = generateAnnoyBoxProps({isConfirmation: isConfirmation});

        addAnnoyBox(annoyBoxProps.id, annoyBoxProps);
    }

    return (
        <div className="sanityModeHidden" style={wrapperStyles}>
            <img src={youWon} alt="ugly fake you won popup ad banner" onClick={() => createAnnoyBox(true)} />

            {Object.keys(annoyBoxes).map(annoyBoxId => {
                const annoyBox = annoyBoxes[annoyBoxId];

                return (
                    <AnnoyBox.Container
                        key={annoyBox.key}
                        id={annoyBox.id}
                        isConfirmation={annoyBox.isConfirmation}
                        position={annoyBox.position}>
                    
                        <AnnoyBox.Header>{annoyBox.title}</AnnoyBox.Header>
                        <AnnoyBox.Content>{annoyBox.content()}</AnnoyBox.Content>
                        <AnnoyBox.ButtonContainer>
                            {annoyBox.buttons.map((annoyBoxButton, index) => (
                                <AnnoyBox.Button key={index} title={annoyBoxButton.title} action={annoyBoxButton.action} annoyBoxId={annoyBox.id} />
                            ))}
                        </AnnoyBox.ButtonContainer>
                    </AnnoyBox.Container>
                )
            })}
        </div>
    );
}