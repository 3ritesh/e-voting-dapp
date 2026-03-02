import React, { useState, useContext } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import VoterCard from "../components/voterCard";
import { VoterContext } from "../context/Voter";
import styles from "../styles/voterList.module.css";

const VoterList = () => {
  const { voterArray, currentAccount, connectWallet } = useContext(VoterContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | voted | eligible | notEligible

  const filteredVoters = voterArray.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.voterAddress.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "voted" && v.voted) ||
      (filter === "eligible" && !v.voted && v.allowed === 1) ||
      (filter === "notEligible" && v.allowed !== 1);

    return matchesSearch && matchesFilter;
  });

  const votedCount = voterArray.filter((v) => v.voted).length;
  const eligibleCount = voterArray.filter((v) => !v.voted && v.allowed === 1).length;
  const turnout =
    voterArray.length > 0 ? Math.round((votedCount / voterArray.length) * 100) : 0;

  const filterButtons = [
    { key: "all", label: `All (${voterArray.length})` },
    { key: "voted", label: `✅ Voted (${votedCount})` },
    { key: "eligible", label: `⏳ Eligible (${eligibleCount})` },
  ];

  return (
    <>
      <Head>
        <title>Voter List | E-Vote</title>
        <meta name="description" content="View all registered voters and their voting status" />
      </Head>

      <div className={styles.page}>
        <NavBar />

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerTag}>👥 Public Registry</div>
            <h1 className={styles.title}>Voter List</h1>
            <p className={styles.subtitle}>All registered voters and their participation status.</p>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{voterArray.length}</div>
              <div className={styles.statLabel}>Total</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{votedCount}</div>
              <div className={styles.statLabel}>Voted</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{turnout}%</div>
              <div className={styles.statLabel}>Turnout</div>
            </div>
          </div>
        </div>

        {/* ── Turnout Bar ─────────────────────────────────────────────────────── */}
        {voterArray.length > 0 && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 1.25rem" }}>
            <div style={{ height: 6, background: "var(--border)", borderRadius: 3 }}>
              <div
                style={{
                  height: "100%",
                  width: `${turnout}%`,
                  background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
                  borderRadius: 3,
                  transition: "width 1s ease",
                  minWidth: turnout > 0 ? 6 : 0,
                }}
              />
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              {turnout}% voter turnout — {votedCount} of {voterArray.length} voted
            </p>
          </div>
        )}

        {/* ── Search ──────────────────────────────────────────────────────────── */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍  Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "0.75rem 1.1rem",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              outline: "none",
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>

        {/* ── List ────────────────────────────────────────────────────────────── */}
        <div className={styles.listContainer}>
          {/* Filter Tabs */}
          <div className={styles.filters}>
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                className={`${styles.filterBtn} ${filter === btn.key ? styles.active : ""}`}
                onClick={() => setFilter(btn.key)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {!currentAccount ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem" }}>🔐</div>
              <p>Connect your wallet to view voter list.</p>
              <button
                onClick={connectWallet}
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.4rem",
                  borderRadius: 8,
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Connect Wallet
              </button>
            </div>
          ) : filteredVoters.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem" }}>🔍</div>
              <p>
                {voterArray.length === 0
                  ? "No voters registered yet."
                  : "No voters match your search."}
              </p>
            </div>
          ) : (
            <div className={styles.voterGrid}>
              {filteredVoters.map((voter) => (
                <VoterCard key={voter.voterId} voter={voter} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoterList;
