"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import clsx from "clsx";

import Button from "@/components/common/Button";
import IconButton from "@/components/common/IconButton";
import Sidebar from "@/components/layout/Sidebar";
import ConnectModal from "@/components/common/ConnectModal";
import AgentWalletModal from "@/components/common/AgentWalletModal";
import ModalComingSoon from "@/components/pages/home/ModalComingSoon";
import UserDropdown from "@/components/layout/Header/UserDropdown";

import { useConnectUser } from "@/hooks/useConnectUser";
import useOutsideClick from "@/hooks/useOutsideClick";
import helpers from "@/lib/helpers";

import { setVisibleConnectModal } from "@/store/reducers/user";

import styles from "./style.module.scss";

export default function Header() {
  const refMenu = useRef();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { generateToken } = useConnectUser();

  const { connectedWallet, visibleConnectModal, visibleAgentModal } =
    useSelector((state) => state.UserReducer);

  const isHomePage = pathname === "/";

  const [isAbsolute, setIsAbsolute] = useState(false);
  const [isMenuOpened, setMenuOpened] = useState(false);
  const [isSidebarOpened, setSidebarOpened] = useState(false);
  const [isCabinetOpened, setCabinetOpened] = useState(false);
  const [visibleSoonModal, setVisibleSoonModal] = useState(false);

  useOutsideClick(refMenu, () => setMenuOpened(false));

  const menu = [
    {
      label: "X/Twitter",
      href: "https://x.com/Lylo_AI",
      soon: false,
      target: "_blank",
    },
    { label: "Discord", href: "https://discord.gg/cDtGSAWgbS", soon: false },
    { label: "$LYLO Staking", href: "#", soon: true },
  ];

  useEffect(() => {
    if (connectedWallet?.address) {
      generateToken().then(() => {});
    }
  }, [connectedWallet]);

  useEffect(() => {
    if (isMenuOpened) {
      setSidebarOpened(false);
      setCabinetOpened(false);
    }
  }, [isMenuOpened]);

  useEffect(() => {
    if (isSidebarOpened) {
      setMenuOpened(false);
      setCabinetOpened(false);
    }
  }, [isSidebarOpened]);

  useEffect(() => {
    if (isCabinetOpened) {
      setSidebarOpened(false);
      setMenuOpened(false);
    }
  }, [isCabinetOpened]);

  return (
    <>
      <ConnectModal visible={visibleConnectModal} />
      <AgentWalletModal visible={visibleAgentModal} />
      <ModalComingSoon
        onClose={() => setVisibleSoonModal(false)}
        isVisible={visibleSoonModal}
      />
      <header className={styles.header}>
        <div className="wrap">
          <Link href="/" className={styles.logo}>
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/img/logo-symbol.svg"
                width={41}
                height={45}
              />
              <img
                src="/img/logo.svg"
                alt="Lylo"
                width={94}
                height={45}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </Link>
          <nav
            className={clsx(styles.menu, isMenuOpened && styles.isOpened)}
            ref={refMenu}
          >
            <ul>
              {menu.map((item) => {
                const hasChildren = item?.children;
                return (
                  <li key={item.label}>
                    {item?.soon ? (
                      <>
                        {item.label}
                        {/*<span>Soon</span>*/}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        target={item?.target ? item.target : undefined}
                      >
                        {item.label}
                        {hasChildren && <IconAngleDown />}
                      </Link>
                    )}
                    {hasChildren && (
                      <div className={styles.childrenDropdown}>
                        <ul className={styles.childrenList}>
                          {item.children.map((el, i) => (
                            <li key={i}>
                              <Link
                                href={el.href}
                                target={el?.target ? el.target : undefined}
                              >
                                {el.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          {isHomePage ? (
            <Button href="/app">App</Button>
          ) : (
            <>
              {connectedWallet?.isConnected ? (
                <>
                  <button
                    type="button"
                    className={styles.btnUser}
                    id="user-dropdown"
                  >
                    <img
                      src={
                        connectedWallet.address.startsWith("0x")
                          ? `https://effigy.im/a/${connectedWallet.address}.svg`
                          : `/img/svg/icons/solana-avatar.svg`
                      }
                      alt={connectedWallet.address}
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                    />
                    {helpers.walletSubstr(connectedWallet.address, 5)}
                  </button>
                  <Tooltip
                    className="no-styles"
                    place="bottom-end"
                    clickable
                    openOnClick
                    anchorSelect="#user-dropdown"
                  >
                    <UserDropdown />
                  </Tooltip>
                </>
              ) : (
                <Button
                  id="btn-auth-modal"
                  onClick={() => dispatch(setVisibleConnectModal(true))}
                >
                  Connect Wallet
                </Button>
              )}
            </>
          )}
          <button
            type="button"
            className={clsx(styles.btnToggle, isMenuOpened && styles.isPressed)}
            onClick={() => setMenuOpened(!isMenuOpened)}
          >
            <img
              src={`/img/svg/icons/menu-${isMenuOpened ? "close" : "open"}.svg`}
              alt="Toggle menu"
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </header>
      <Sidebar isOpened={isSidebarOpened} setOpened={setSidebarOpened} />
    </>
  );
}

const IconAngleDown = () => (
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    stroke="#DEDEDE"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.5 7L8.5 11L12.5 7" />
  </svg>
);
