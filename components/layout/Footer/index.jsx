import styles from "./style.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <ul className={styles.socials}>
          <li>
            <a href="https://x.com/Lylo_AI" target="_blank" rel="noopener">
              <img
                src="/img/svg/icons/socials/x.svg"
                alt="X"
                width={24}
                height={24}
                loading="lazy"
                decoding="async"
              />
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/cDtGSAWgbS"
              target="_blank"
              rel="noopener"
            >
              <img
                src="/img/svg/icons/socials/discord.svg"
                alt="Discord"
                width={24}
                height={24}
                loading="lazy"
                decoding="async"
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
