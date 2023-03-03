import styles from './CrappyAds.module.scss';

const SimpleTrick = {
    title: 'This one simple trick...',
    content: () => (
        <div className={`${styles.textContainer} ${styles.simpleTrick}`}>
            <p>Get a huge weiner!</p>
        </div>
    ),
    buttons: [
        { title: 'LOL k' },
        { title: 'Cancel' },
    ]
}

export default SimpleTrick;