import styles from './CrappyAds.module.scss';

const MobileGame = {
    title: 'Play our shitty mobile game!',
    content: () => (
        <div className={`${styles.textContainer} ${styles.mobileGame}`}>
            <p>The lined pockets of 1 bazillion</p>
            <p>paid content creators can't be wrong!</p>
        </div>
    ),
    buttons: [
        { title: 'I <3 microtransations' },
        { title: 'Cancel' },
    ]
}

export default MobileGame;