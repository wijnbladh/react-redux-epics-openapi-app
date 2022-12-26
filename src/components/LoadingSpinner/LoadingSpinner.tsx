// Credits to https://projects.lukehaas.me/css-loaders/

import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner: React.FC = () => {
  return <div className={styles.loader}>Loading...</div>;
};
