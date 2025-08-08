import React from 'react';
import styles from './header.scss';
import { Home } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();

    return (
         <div className={styles.container}>
            <div className={styles.header}>
                <Home color='#00796b' size={32} className={styles.icon} />
                <div className={styles.titleContainer}>
                    <p className={styles.titleTop}>
                        {t("clinic", "Clinic")}
                    </p>
                    <p className={styles.titleBottom}>
                        {t("SSEMRhome", "SSEMR Home")}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Header;