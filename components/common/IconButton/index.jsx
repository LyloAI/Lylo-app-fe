import clsx from "clsx";

import styles from "./style.module.scss";

export default function IconButton({ className = "", children, ...props }) {
  return (
    <button className={clsx(styles.btn, className)} type="button" {...props}>
      {children}
    </button>
  );
}
