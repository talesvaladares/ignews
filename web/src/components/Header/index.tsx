import styles from './styles.module.scss';

import {SiginButton} from '../SigninButton';

export function Header () {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news"/>
                <nav>
                    <a className={styles.active}>Home</a>
                    <a>Posts</a>
                </nav>

                <SiginButton/>
            </div>
        </header>
    );
}