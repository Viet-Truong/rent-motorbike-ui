import styles from '@/scss/globalStyles.module.scss';

const GlobalStyles = ({ children }: { children: JSX.Element }) => {
  return <div className={styles.global}>{children}</div>;
};

export default GlobalStyles;
