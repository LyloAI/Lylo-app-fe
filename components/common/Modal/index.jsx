"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import IconButton from "@/components/common/IconButton";

import styles from "./style.module.scss";

export default function Modal({
  children,
  title = "",
  isVisible = false,
  hideClose = false,
  onClose = () => {},
  className,
}) {
  const ref = useRef();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isVisible && ref.current && ref.current === e.target) {
        onClose();
      }
    };
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("click", handleOutsideClick, { passive: true });
    document.addEventListener("keyup", handleEscapeKey);

    if (isVisible) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keyup", handleEscapeKey);
      document.body.style.overflowY = "";
    };
  }, [isVisible, onClose]);

  return (
    <>
      {isClient && (
        <div
          className={clsx(styles.background, isVisible && styles.isVisible)}
          ref={ref}
        >
          <div className={clsx(styles.modal, className)}>
            {title && <div className={styles.title}>{title}</div>}
            {children}
            {!hideClose && (
              <IconButton className={styles.btnClose} onClick={() => onClose()}>
                <img
                  src="/img/svg/icons/close.svg"
                  alt="Close"
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
                />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const IconClose = () => (
  <svg
    width="30"
    height="27"
    viewBox="0 0 30 27"
    fill="#B5CAE5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.6464 19.3535L8.64645 8.35355L9.35355 7.64644L20.3536 18.6464L19.6464 19.3535Z" />
    <path d="M8.64645 18.6464L19.6464 7.64644L20.3536 8.35355L9.35355 19.3535L8.64645 18.6464Z" />
    <path d="M1.33861 2.25854L3.53044 0.123245L4.75161 1.37674L2.55978 3.51204C2.12194 3.93857 1.875 4.5239 1.875 5.13516V21.8648C1.875 22.4761 2.12194 23.0614 2.55978 23.488L4.75161 25.6232L3.53044 26.8767L1.33861 24.7415C0.562652 23.9855 0.125 22.9481 0.125 21.8648V5.13516C0.125 4.05185 0.562652 3.01448 1.33861 2.25854Z" />
    <path d="M27.0811 3.51204L24.8893 1.37674L26.1104 0.123245L28.3023 2.25854C29.0782 3.01448 29.5159 4.05185 29.5159 5.13516V21.8648C29.5159 22.9481 29.0782 23.9855 28.3023 24.7415L26.1104 26.8767L24.8893 25.6232L27.0811 23.488C27.5189 23.0614 27.7659 22.4761 27.7659 21.8648V5.13516C27.7659 4.5239 27.5189 3.93857 27.0811 3.51204Z" />
  </svg>
);
