import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import CandidateCard from "../components/card";
import Button from "../components/Button";
import { VoterContext } from "../context/Voter";
import styles from "../styles/index.module.css";

const Home = () => {
  const {
    currentAccount,
    connectWallet,
    candidateArray,
    electionDetails,
    error,
    setError,
    loading,
  } = useContext(VoterContext);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  const now = () => Math.floor(Date.now() / 1000);

  // ─── Countdown Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!electionDetails?.endTime) return;

    const tick = () => {
      const diff = Math.max(0, electionDetails.endTime - now());
      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [electionDetails]);

  const isActive =
    electionDetails &&
    now() >= electionDetails.startTime &&
    now() <= electionDetails.endTime;

  const isEnded = electionDetails && now() > electionDetails.endTime;
  const isUpcoming = electionDetails && now() < electionDetails.startTime;

  const totalVotes = candidateArray.reduce((sum, c) => sum + c.voteCount, 0);

  const winner = isEnded && candidateArray.length > 0
    ? candidateArray.reduce((a, b) => (a.voteCount > b.voteCount ? a : b))
    : null;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <>
      <Head>
        <title>E-Vote | Blockchain Voting</title>
        <meta name="description" content="Decentralized e-voting platform powered by blockchain technology" />
      </Head>

      <div className={styles.page}>
        <NavBar />

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        {error && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>
            <div className="alert alert-error" style={{ marginTop: "1rem" }}>
              ⚠️ {error}
              <button
                onClick={() => setError("")}
                style={{ marginLeft: "auto", background: "none", color: "inherit", fontSize: "1.1rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className={styles.hero}>
          <div className={styles.heroTag}>
            ⛓️ Powered by Blockchain
          </div>
          <h1 className={styles.heroTitle}>
            <span className="gradient-text">Transparent,</span><br />
            Tamper-proof Voting
          </h1>
          <p className={styles.heroSubtitle}>
            Cast your vote securely on the Ethereum blockchain. Every vote is immutable, verifiable, and anonymous.
          </p>
        </div>

        {/* ── Election Info ─────────────────────────────────────────────────── */}
        {electionDetails ? (
          <>
            <div className={styles.electionPanel}>
              <div className={styles.electionCard}>
                <div className={styles.electionInfo}>
                  <h2>{electionDetails.title}</h2>
                  <div className={styles.electionMeta}>
                    🏛️ {electionDetails.organization} &nbsp;·&nbsp;
                    {new Date(electionDetails.endTime * 1000).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    {isActive && <span className={styles.statusActive}>🟢 Voting Active</span>}
                    {isEnded && <span className={styles.statusEnded}>🔴 Election Ended</span>}
                    {isUpcoming && <span className={styles.statusUpcoming}>🟡 Upcoming</span>}
                  </div>
                </div>

                {/* Countdown */}
                {!isEnded && (
                  <div className={styles.countdown}>
                    {[
                      { num: pad(timeLeft.days), label: "Days" },
                      { num: pad(timeLeft.hours), label: "Hours" },
                      { num: pad(timeLeft.minutes), label: "Mins" },
                      { num: pad(timeLeft.seconds), label: "Secs" },
                    ].map((item, i) => (
                      <React.Fragment key={i}>
                        <div className={styles.countItem}>
                          <span className={styles.countNum}>{item.num}</span>
                          <span className={styles.countLabel}>{item.label}</span>
                        </div>
                        {i < 3 && <span className={styles.countSep}>:</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Winner Banner */}
            {winner && (
              <div className={styles.winner}>
                <div className={styles.winnerCard}>
                  <span className={styles.winnerEmoji}>🏆</span>
                  <div>
                    <div className={styles.winnerTitle}>Election Winner</div>
                    <div className={styles.winnerName}>{winner.name}</div>
                    <div className={styles.winnerVotes}>{winner.voteCount} votes received</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ maxWidth: 900, margin: "1rem auto", padding: "0 1.5rem" }}>
            <div className="alert" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              ℹ️ No election has been created yet. The contract owner can create one.
            </div>
          </div>
        )}

        {/* ── Candidates ────────────────────────────────────────────────────── */}
        <div className={styles.candidatesSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Candidates</h2>
              <p className={styles.sectionSubtitle}>
                {candidateArray.length} candidate{candidateArray.length !== 1 ? "s" : ""} · {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {!currentAccount ? (
            <div className={styles.connectPrompt}>
              <div style={{ fontSize: "3rem" }}>🔐</div>
              <h3>Connect Your Wallet</h3>
              <p>Connect MetaMask to participate in voting and see live results.</p>
              <Button onClick={connectWallet}>Connect Wallet</Button>
            </div>
          ) : candidateArray.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "4rem" }}>🗳️</div>
              <p>No candidates registered yet.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {candidateArray.map((candidate, index) => (
                <CandidateCard
                  key={candidate.candidateId}
                  candidate={candidate}
                  totalVotes={totalVotes}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
