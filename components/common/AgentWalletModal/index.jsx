import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import lscache from "lscache";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

import { setVisibleAgentModal } from "@/store/reducers/user";

import { useAuth } from "@/logic/wagmi/hooks/useAuth";
import { useAuth as useAuthSol } from "@/logic/solwalletadapter/hooks/useAuth";
import { walletsIds } from "@/logic/solwalletadapter/wallets";

import styles from "./style.module.scss";

export default function AgentWalletModal({ visible = false }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { logout } = useAuth();
  const { logout: logoutSol } = useAuthSol();

  const { connectedWallet } = useSelector((state) => state.UserReducer);

  const updateWalletInfo = async (walletData) => {
    const message = "Created wallet address: ";
    toast.success(`${message}${walletData.address}`);
  };

  const downloadWalletInfo = (walletData) => {
    const data = {
      address: walletData.address,
      privateKey: walletData.privateKey,
      date: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet-${data.address.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const createWallet = async (e) => {};

  return (
    <Modal
      isVisible={visible}
      hideClose={true}
      title="Create Associated Wallet"
      className={styles.modal}
    >
      <div className={styles.form}>
        <Button
          // secondary
          onClick={createWallet}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create wallet and download Private Key"}
        </Button>

        {error && <div className={styles.error}>{error}</div>}

        <div className="text-center text-gray-500">or</div>

        <Button
          secondary
          onClick={async () => {
            dispatch(setVisibleAgentModal(false));
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
    </Modal>
  );
}
