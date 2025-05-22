"use client";

import dynamic from "next/dynamic";

const Countdown = dynamic(
  () => import("react-countdown").then((response) => response.default),
  { ssr: false }
);

const CountdownTimer = (props) => {
  const renderer = ({
    formatted: { days, hours, minutes, seconds },
    completed,
  }) => {
    return (
      <>
        {days > 0 ? days + "d : " : ""}
        {hours > 0 ? hours + "h : " : ""}
        {minutes > 0 ? minutes + "m : " : ""}
        {seconds > 0 ? seconds + "s" : "0s"}
      </>
    );
  };

  return <Countdown zeroPadTime={2} renderer={renderer} {...props} />;
};

export default CountdownTimer;
