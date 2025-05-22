"use client";

import Link from "next/link";
import clsx from "clsx";

import TextLoader from "@/components/common/TextLoader";

import styles from "./style.module.scss";

export default function Button({
  type = "button",
  size = "md",
  href,
  secondary = false,
  loading = false, // state
  className = "",
  children,
  ...props
}) {
  const classes = clsx(
    styles.btn,
    className,
    size === "xs" && styles.sizeXS,
    size === "sm" && styles.sizeSM,
    size === "lg" && styles.sizeLG,
    props?.disabled && styles.isDisabled,
    secondary && styles.isSecondary,
    loading && styles.isDisabled
  );

  const content = loading ? (
    <>
      <TextLoader className={styles.spinner} />
      {children}
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {content}
    </button>
  );
}
