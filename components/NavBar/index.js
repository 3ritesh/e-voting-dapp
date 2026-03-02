import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { VoterContext } from "../../context/Voter";
import styles from "./NavBar.module.css";

const NavBar = () => {
    const { connectWallet, currentAccount, isOwner } = useContext(VoterContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const truncate = (addr) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    const navItems = [
        { href: "/", label: "🗳️ Vote", always: true },
        { href: "/voterList", label: "👥 Voters", always: true },
        { href: "/allowed-voters", label: "✅ Add Voter", ownerOnly: true },
        { href: "/candidate-regisration", label: "📋 Add Candidate", ownerOnly: true },
    ];

    const visibleItems = navItems.filter((i) => i.always || (i.ownerOnly && isOwner));

    return (
        <nav className={styles.nav}>
            <div className={styles.navInner}>
                {/* Logo — single <a> child required by Next.js 12 */}
                <Link href="/" passHref>
                    <a className={styles.logo}>
                        <div className={styles.logoIcon}>⛓</div>
                        <span className={styles.logoText}>E-Vote</span>
                    </a>
                </Link>

                {/* Nav Links */}
                <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
                    {visibleItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} passHref>
                                <a
                                    className={`${styles.navLink} ${router.pathname === item.href ? styles.active : ""}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right side */}
                <div className={styles.navRight}>
                    {currentAccount ? (
                        <>
                            {isOwner && (
                                <span className="badge badge-accent" style={{ fontSize: "0.75rem" }}>
                                    Owner
                                </span>
                            )}
                            <div className={styles.accountBadge}>
                                <span className={styles.accountDot}></span>
                                {truncate(currentAccount)}
                            </div>
                        </>
                    ) : (
                        <button className={styles.connectBtn} onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    )}

                    {/* Hamburger */}
                    <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
