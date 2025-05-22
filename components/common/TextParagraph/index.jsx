"use client";

import { useEffect, useId } from "react";
import { useInView } from "react-intersection-observer";
// import SplitType from "split-type";
import clsx from "clsx";

import styles from "./style.module.scss";

export default function TextParagraph({
  className,
  children,
  tac = false,
  fade = true,
  ...props
}) {
  const { ref, inView } = useInView({
    threshold: 0.35,
    triggerOnce: true,
  });

  const id = useId().replace(/:/g, "");

  // useEffect(() => {
  //   if (id && fade) new SplitType(`#${id}`, { types: "words" });
  // }, [children, id, fade]);

  const classes = clsx(
    styles.block,
    className,
    tac && styles.tac,
    inView && styles.inView,
    !fade && styles.noFade
  );

  return (
    <div className={classes} id={id} ref={ref}>
      {children}
    </div>
  );
}
