import styles from './CrappyAds.module.scss';

const STD = {
        title: 'Your computer might have an STD!',
        content: () => (
            <div className={`${styles.textContainer} ${styles.std}`}>
                <p>Get our malware to replace your existing malware with <strong>even worse malware</strong>!</p>
            </div>
        ),
        buttons: [
            { title: 'Gotta catch em all!' },
            { title: 'Cancel' },
        ]
    }

    export default STD;