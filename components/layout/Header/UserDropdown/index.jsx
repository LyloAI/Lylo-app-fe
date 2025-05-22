"use client";

import { useRef } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";

import Copier from "@/components/common/Copier";
import Button from "@/components/common/Button";

import { useAuth } from "@/logic/wagmi/hooks/useAuth";
import { useAuth as useAuthSol } from "@/logic/solwalletadapter/hooks/useAuth";

import { walletsIds } from "@/logic/solwalletadapter/wallets";

import helpers from "@/lib/helpers";

import styles from "./style.module.scss";

export default function UserDropdown() {
  const { connectedWallet, user } = useSelector((state) => state.UserReducer);

  const { logout } = useAuth();
  const { logout: logoutSol } = useAuthSol();

  const ref = useRef();

  return (
    connectedWallet?.address && (
      <div className={styles.dropdown} ref={ref}>
        {user && user?.walletAddress && (
          <>
            <div className={styles.head}>
              <div className={styles.user}>
                <img
                  src={
                    user.walletAddress.startsWith("0x")
                      ? `https://effigy.im/a/${user.realWalletAddress || user.walletAddress}.svg`
                      : `/img/svg/icons/solana-avatar.svg`
                  }
                  alt={user.walletAddress}
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                />
                {helpers.walletSubstr(
                  user.realWalletAddress || user.walletAddress,
                  8,
                )}
                <Copier
                  copyText={user.realWalletAddress || user.walletAddress}
                />
              </div>
            </div>

            {user?.agentWalletAddress &&
              user?.agentWalletAddress !== ethers.ZeroAddress && (
                <div className={styles.subHead}>
                  <div className={styles.subtitle}>Associated Wallet</div>
                  <div className={styles.head}>
                    <div className={styles.user}>
                      <img
                        src={
                          user.agentWalletAddress.startsWith("0x")
                            ? `https://effigy.im/a/${user.agentRealWalletAddress || user.agentWalletAddress}.svg`
                            : `/img/svg/icons/solana-avatar.svg`
                        }
                        alt={user?.agentWalletAddress}
                        width={24}
                        height={24}
                        loading="lazy"
                        decoding="async"
                      />
                      {helpers.walletSubstr(
                        user?.agentRealWalletAddress ||
                          user?.agentWalletAddress,
                        user?.agentWalletAddress === ethers.ZeroAddress ? 6 : 8,
                      )}
                      <Copier
                        copyText={
                          user?.agentRealWalletAddress ||
                          user?.agentWalletAddress
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
          </>
        )}

        <div className={styles.section}>
          <Button
            className={styles.btn}
            onClick={async () => {
              if (walletsIds.includes(connectedWallet.provider)) {
                await logoutSol();
              } else {
                await logout();
              }
            }}
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    )
  );
}
