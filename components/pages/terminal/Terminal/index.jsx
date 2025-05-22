"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import TypeIt from "typeit-react";
import Link from "next/link";
import clsx from "clsx";
import IconButton from "@/components/common/IconButton";

import { useSocket } from "@/hooks/useSocket";

import { useAuth } from "@/logic/wagmi/hooks/useAuth";
import { API_URL } from "@/logic/constants/config";

import helpers from "@/lib/helpers";

import styles from "./style.module.scss";
import { useConnectUser } from "@/hooks/useConnectUser";

const transformMarkdownToHtml = (text) => {
  return text.replace(
    /\[(.*?)\]\((https:\/\/[^\)]+)\)/g,
    `<a href="$2" target="_blank" rel="noopener noreferrer">[$1]</a>`,
  );
};

export default function Terminal() {
  const refMessagesLoop = useRef();
  const router = useRouter();
  const params = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { connectedWallet } = useSelector((state) => state.UserReducer);
  const { logout } = useAuth();
  const { generateToken } = useConnectUser();

  let socket = null;

  socket = useSocket(
    process.env.NEXT_PUBLIC_SOCKET_API_URL,
    connectedWallet?.token?.jwtToken,
  );

  const mainInput = document.getElementById("request");

  const formatMessage = (message) => {
    if (message.type === "question") {
      return `\n> ${message.message}\n`;
    } else {
      let content = message.message || "";
      content = transformMarkdownToHtml(content);

      // Process line breaks and format long lines
      content = content
        .split("\n")
        .map((line) => {
          if (line.length > 80 && !line.includes("<a href=")) {
            // Don't break lines containing links
            return line.match(/.{1,80}(?:\s|$)/g).join("\n  ");
          }
          return line;
        })
        .join("\n");

      return `\n${content}\n`;
    }
  };

  const onHandleInput = (e) => {
    setMessage(e.target.value);
  };

  const onHandleSubmit = async (e) => {
    if (connectedWallet?.isConnected) {
      if (e?.key) {
        if (e.key === "Enter") {
          if (message !== "") {
            await sendMessage(message, "question");
          } else {
            setError(true);
          }
        } else {
          if (message !== "") {
            await sendMessage(message, "question");
          } else {
            setError(true);
          }
        }
      }
    } else {
      window.document.getElementById("btn-auth-modal").click();
    }
  };

  const sendMessage = async (msg, type = "") => {
    setMessages((prevState) => [...prevState, { type, message: msg }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${connectedWallet?.token.jwtToken}`,
        },
        body: JSON.stringify({
          content: msg,
        }),
      });

      if (response.status === 401) {
        toast.error("Session expired. Please reinitialize your wallet.");
        await logout();
        window.document.getElementById("btn-auth-modal").click();
      }

      if (!response.ok) {
        toast.error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [
          ...prev,
          {
            type: "answer",
            message: data.content.replaceAll("\n", "<br/>"),
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          message: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      mainInput.focus();
    }
  };

  const getNotifications = async () => {};

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(false), 500);
    }
  }, [error]);

  useEffect(() => {
    refMessagesLoop.current.scrollTop = refMessagesLoop?.current?.scrollHeight;
  }, [messages]);

  useMemo(() => {
    if (socket) {
      getNotifications().then((logs) => {});
    }
  }, [socket]);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.terminal}>
          <div className={styles.messages} ref={refMessagesLoop}>
            {messages.map((item, idx) => (
              <div key={idx}>
                {item.type === "question" ? (
                  <div className={styles.question}>
                    <p>{item.message}</p>
                  </div>
                ) : (
                  <div className={styles.answer}>
                    <TypeIt
                      options={{
                        speed: 5,
                        lifeLike: true,
                        html: true,
                        strings: [formatMessage(item)],
                        cursor: false,
                        afterStep: () => {
                          refMessagesLoop.current.scrollTop =
                            refMessagesLoop?.current?.scrollHeight;
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={styles.answer}>
                <img
                  src="/img/svg/icons/loader.svg"
                  alt="Loading..."
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
                  className={styles.loader}
                />
              </div>
            )}
          </div>
          <div className={styles.form}>
            <div className={clsx(styles.formField, error && styles.error)}>
              <input
                id="request"
                type="text"
                placeholder="Your DeFi prompt"
                value={message}
                onChange={onHandleInput}
                onKeyUp={onHandleSubmit}
                autoFocus
              />
              <IconButton
                title="Send"
                aria-label="Send"
                className={styles.btnSend}
                onClick={onHandleSubmit}
              >
                <img
                  src="/img/svg/icons/send.svg"
                  alt="Send"
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
                />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <style>{`body > footer {display: none !important}`}</style>
    </>
  );
}
