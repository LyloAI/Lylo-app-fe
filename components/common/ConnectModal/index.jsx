import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useConnect } from "wagmi";
import lscache from "lscache";

import { useWallet } from "@solana/wallet-adapter-react";

import Modal from "@/components/common/Modal";

import { useAuth } from "@/logic/wagmi/hooks/useAuth";
import { useAuth as useAuthSol } from "@/logic/solwalletadapter/hooks/useAuth";

import { PROJECT_CONNECTED_WALLET } from "@/logic/constants/user";
import { walletsIds, walletIcons } from "@/logic/wagmi/wallets";
import {
  walletsIds as solWalletsIds,
  walletIcons as solWalletIcons,
} from "@/logic/solwalletadapter/wallets";

import {
  setConnectedWallet,
  setVisibleConnectModal,
} from "@/store/reducers/user";

import styles from "./style.module.scss";

const sortOrder = (array, order, key) => {
  array.sort(function (a, b) {
    const A = a[key],
      B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return array;
};

export default function ConnectModal({ visible = false }) {
  const { login } = useAuth();
  const { login: loginSol, checkConnected } = useAuthSol();

  const dispatch = useDispatch();

  const { connectors } = useConnect();
  const { wallets, publicKey, disconnect, connecting } = useWallet();

  const [connectorsList, setConnectorsList] = useState([]);
  const [connectorsSolList, setConnectorsSolList] = useState([]);

  useEffect(() => {
    setConnectorsList([]);
    if (connectors?.length > 0) {
      const array = connectors.filter((connector) =>
        walletsIds.includes(connector.id),
      );

      const newList = sortOrder(array, walletsIds, "id");
      setConnectorsList(newList);
    }
  }, [connectors]);

  useEffect(() => {
    setConnectorsSolList([]);
    if (wallets?.length > 0) {
      const array = wallets.filter((wallet) =>
        solWalletsIds.includes(wallet.adapter.name.toLowerCase()),
      );

      setConnectorsSolList(array);
    }
  }, [wallets]);

  useEffect(() => {
    if (publicKey) {
      const connectedWallet = lscache.get(PROJECT_CONNECTED_WALLET);
      checkConnected(connectedWallet).then((r) => {});
    }
  }, [publicKey]);

  return (
    <Modal
      isVisible={visible}
      onClose={() => dispatch(setVisibleConnectModal(false))}
      title="Connect Wallet"
    >
      <ul className={styles.connectorsList}>
        {connectorsList.map((connector) => (
          <li key={connector.uid}>
            <button
              type="button"
              onClick={async () => {
                window.localStorage.setItem("walletConnector", connector.id);
                window.localStorage.setItem(
                  "walletConnectorName",
                  connector.name,
                );
                window.localStorage.setItem(
                  "walletConnectorProvider",
                  connector.id,
                );
                window.localStorage.removeItem("walletDisconnected");
                dispatch(setVisibleConnectModal(false));

                await login({ connector });
              }}
            >
              <img
                src={walletIcons[connector.id] || connector.icon}
                alt=""
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
              />
              {connector.name}
            </button>
          </li>
        ))}
        {connectorsSolList.map((connector) => (
          <li key={connector.adapter.name}>
            <button
              type="button"
              onClick={async () => {
                window.localStorage.setItem(
                  "walletConnector",
                  connector.adapter.name.toLowerCase(),
                );
                window.localStorage.setItem(
                  "walletConnectorName",
                  connector.adapter.name,
                );
                window.localStorage.setItem(
                  "walletConnectorProvider",
                  connector.adapter.name.toLowerCase(),
                );
                window.localStorage.removeItem("walletDisconnected");
                dispatch(setVisibleConnectModal(false));

                await loginSol(connector.adapter.name);
              }}
            >
              <img
                src={
                  solWalletIcons[connector.adapter.name.toLowerCase()] ||
                  connector.adapter.icon
                }
                alt=""
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
              />
              {connector.adapter.name}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
