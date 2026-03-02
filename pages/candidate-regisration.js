import React, { useState, useContext } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { VoterContext } from "../context/Voter";
import styles from "../styles/allowedVoter.module.css";

const CandidateRegistration = () => {
  const { registerCandidate, candidateArray, isOwner, currentAccount, connectWallet, loading, error, setError } =
    useContext(VoterContext);

  const [form, setForm] = useState({
    address: "",
    name: "",
    age: "",
    image: "",
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.name || !form.age) {
      setError("Please fill in all required fields.");
      return;
    }
    await registerCandidate(form.address, form.age, form.name, form.image, "");
    setSuccess("Candidate registered successfully!");
    setForm({ address: "", name: "", age: "", image: "" });
  };

  return (
    <>
      <Head>
        <title>Register Candidate | E-Vote</title>
        <meta name="description" content="Register a new candidate for the election" />
      </Head>

      <div className={styles.page}>
        <NavBar />

        <div className={styles.header}>
          <div className={styles.headerTag}>📋 Admin Panel</div>
          <h1 className={styles.title}>Register Candidate</h1>
          <p className={styles.subtitle}>
            Add candidates who will participate in the election.
          </p>
        </div>

        {!currentAccount ? (
          <div className={styles.ownerGate}>
            <div style={{ fontSize: "3rem" }}>🔐</div>
            <h3>Wallet Not Connected</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Connect your wallet to access admin functions.
            </p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        ) : !isOwner ? (
          <div className={styles.ownerGate}>
            <div style={{ fontSize: "3rem" }}>🚫</div>
            <h3>Access Denied</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Only the contract owner can register candidates.
            </p>
          </div>
        ) : (
          <div className={styles.content}>
            {/* ── Form ──────────────────────────────────────────────────────── */}
            <div className={styles.formPanel}>
              <div className={styles.formTitle}>🧑‍💼 Candidate Details</div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" style={{ marginBottom: "1rem" }}>
                  ✅ {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.formFields}>
                  <Input
                    label="Wallet Address"
                    name="address"
                    placeholder="0x..."
                    value={form.address}
                    onChange={handleChange}
                    required
                    hint="Candidate's Ethereum wallet address"
                  />
                  <Input
                    label="Full Name"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Age"
                    name="age"
                    type="number"
                    placeholder="e.g. 35"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Image URL"
                    name="image"
                    placeholder="https://... (optional)"
                    value={form.image}
                    onChange={handleChange}
                    hint="Direct URL to candidate photo"
                  />
                </div>

                <div className={styles.formActions}>
                  <Button type="submit" loading={loading} fullWidth>
                    Register Candidate
                  </Button>
                </div>
              </form>
            </div>

            {/* ── Registered Candidates List ────────────────────────────────── */}
            <div className={styles.listPanel}>
              <div className={styles.listTitle}>
                Registered
                <span className={styles.countBadge}>{candidateArray.length}</span>
              </div>
              <div className={styles.listItems}>
                {candidateArray.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>
                    No candidates yet
                  </p>
                ) : (
                  candidateArray.map((c) => (
                    <div key={c.candidateId} className={styles.listItem}>
                      <div className={styles.listItemAvatar}>
                        {c.image ? <img src={c.image} alt={c.name} /> : "🧑‍💼"}
                      </div>
                      <div>
                        <div className={styles.listItemName}>{c.name}</div>
                        <div className={styles.listItemMeta}>Age {c.age} · ID #{c.candidateId}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CandidateRegistration;
