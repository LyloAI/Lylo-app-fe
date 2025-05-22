import clsx from "clsx";

import styles from "./style.module.scss";

export default function TextLoader({ children, className }) {
  return children ? (
    <span className={clsx(styles.label, className)}>
      <img
        src="/img/svg/icons/loader.svg"
        alt="Loading..."
        width={16}
        height={16}
        loading="lazy"
        className={styles.loader}
        title="Loading..."
        aria-label="Loading..."
      />
      {children}
    </span>
  ) : (
    <img
      src="/img/svg/icons/loader.svg"
      alt="Loading..."
      width={16}
      height={16}
      loading="lazy"
      className={clsx(styles.loader, className)}
      title="Loading..."
      aria-label="Loading..."
    />
  );
}
