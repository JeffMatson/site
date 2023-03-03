import styles from './CrappyAds.module.scss';

const HotSingles = {
    title: 'Hot singles in your area!',
    content: () => (
        <div className={`${styles.textContainer} ${styles.hotSingles}`}>
            <p>Literally right there staring at your screen!</p>
            <p><strong>Right now!</strong></p>
            <p>It's you! You sexy human specimen.</p>
        </div>
    ),
    buttons: [
        { title: 'Gimme the goods!' },
        { title: 'Cancel' },
    ]
}

export default HotSingles;