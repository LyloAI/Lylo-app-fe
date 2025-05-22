"use client";

import { useState, useId } from "react";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";

import styles from "./style.module.scss";

export default function Copier({
  copyText,
  noStyles = false,
  className = "",
  children,
}) {
  const [visible, setVisible] = useState(false);

  const id = useId().replace(/:/g, "");

  const onCopy = async () => {
    setVisible(true);
    await navigator.clipboard.writeText(copyText);
    setTimeout(() => setVisible(false), 1000);
  };

  return (
    <>
      <Tooltip
        anchorSelect={"#" + id}
        isOpen={visible}
        place="bottom-end"
        noArrow
        offset={8}
        className={clsx(styles.tooltip, "no-styles")}
      >
        <span>Copied</span>
      </Tooltip>
      <button
        type="button"
        onClick={onCopy}
        className={clsx(styles.btn, className, noStyles && styles.noStyles)}
        title={copyText}
        id={id}
      >
        {children && <span>{children}</span>}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#DEDEDE"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.6665 3.3647C6.70865 3.10083 6.77157 2.86936 6.85829 2.66667C7.31236 1.60536 8.33317 1.33334 10.6137 1.33334C13.9998 1.33334 14.6665 2.66667 14.6665 5.39607C14.6665 7.33334 14.5179 8.80034 13.3332 9.17376C13.1331 9.23682 12.9035 9.28779 12.6401 9.33334" />
          <path d="M6.00016 14.6667C9.3335 14.6667 10.6668 13.6667 10.6668 10C10.6668 6.33334 9.3335 5.33334 6.00016 5.33334C2.66683 5.33334 1.3335 6.11111 1.3335 10C1.3335 13.8889 2.66683 14.6667 6.00016 14.6667Z" />
          <path d="M4.66667 6C4.66667 6 5.06971 7.59695 4.33333 8.33333C3.59695 9.06971 2 8.66667 2 8.66667" />
        </svg>
      </button>
    </>
  );
}
