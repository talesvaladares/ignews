import Link from 'next/link'


import styles from './styles.module.scss';

import {SiginButton} from '../SigninButton';
import {ActiveLink} from '../ActiveLink';

export function Header () {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news"/>
                <nav>
                    <ActiveLink href='/' activeClassName={styles.active}>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href='/posts' activeClassName={styles.active} prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                  
                </nav>

                <SiginButton/>
            </div>
        </header>
    );
}