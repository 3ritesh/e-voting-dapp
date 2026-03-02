import React, { useState, useContext } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { VoterContext } from "../context/Voter";
import styles from "../styles/allowedVoter.module.css";

const AllowedVoters = () => {
  const {
    giveVoterRight,
    voterArray,
    isOwner,
    currentAccount,
    connectWallet,
    createElection,
    electionDetails,
    loading,
    error,
    setError,
  } = useContext(VoterContext);

  const [voterForm, setVoterForm] = useState({
    address: "",
    name: "",
    image: "",
  });

  const [electionForm, setElectionForm] = useState({
    title: "",
    organization: "",
    startTime: "",
    endTime: "",
  });

  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("voter"); // "voter" | "election"

  const handleVoterChange = (e) => {
    setVoterForm({ ...voterForm, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleElectionChange = (e) => {
    setElectionForm({ ...electionForm, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleVoterSubmit = async (e) => {
    e.preventDefault();
    if (!voterForm.address || !voterForm.name) {
      setError("Address and name are required.");
      return;
    }
    await giveVoterRight(voterForm.address, voterForm.name, voterForm.image, "");
    setSuccess("Voter whitelisted successfully!");
    setVoterForm({ address: "", name: "", image: "" });
  };

  const handleElectionSubmit = async (e) => {
    e.preventDefault();
    if (!electionForm.title || !electionForm.organization || !electionForm.startTime || !electionForm.endTime) {
      setError("All election fields are required.");
      return;
    }
    await createElection(
      electionForm.title,
      electionForm.organization,
      electionForm.startTime,
      electionForm.endTime
    );
    setSuccess("Election created successfully!");
  };

  return (
    <>
      <Head>
        <title>Manage Voters | E-Vote</title>
        <meta name="description" content="Whitelist voters and create elections" />
      </Head>

      <div className={styles.page}>
        <NavBar />

        <div className={styles.header}>
          <div className={styles.headerTag}>⚙️ Admin Panel</div>
          <h1 className={styles.title}>Voter Management</h1>
          <p className={styles.subtitle}>
            Whitelist voters and manage election settings.
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
              Only the contract owner can manage voters and elections.
            </p>
          </div>
        ) : (
          <div className={styles.content}>
            {/* ── Form Panel ────────────────────────────────────────────────── */}
            <div className={styles.formPanel}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <button
                  onClick={() => { setActiveTab("voter"); setSuccess(""); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "0.6rem",
                    borderRadius: 8,
                    border: "1px solid",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    transition: "all 0.2s",
                    background: activeTab === "voter" ? "var(--accent)" : "var(--bg-secondary)",
                    color: activeTab === "voter" ? "#fff" : "var(--text-secondary)",
                    borderColor: activeTab === "voter" ? "var(--accent)" : "var(--border)",
                  }}
                >
                  ✅ Add Voter
                </button>
                <button
                  onClick={() => { setActiveTab("election"); setSuccess(""); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "0.6rem",
                    borderRadius: 8,
                    border: "1px solid",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    transition: "all 0.2s",
                    background: activeTab === "election" ? "var(--accent)" : "var(--bg-secondary)",
                    color: activeTab === "election" ? "#fff" : "var(--text-secondary)",
                    borderColor: activeTab === "election" ? "var(--accent)" : "var(--border)",
                  }}
                >
                  🗓️ Election
                </button>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: "1rem" }}>⚠️ {error}</div>
              )}
              {success && (
                <div className="alert alert-success" style={{ marginBottom: "1rem" }}>✅ {success}</div>
              )}

              {/* Add Voter Tab */}
              {activeTab === "voter" && (
                <>
                  <div className={styles.formTitle}>👤 Whitelist a Voter</div>
                  <form onSubmit={handleVoterSubmit}>
                    <div className={styles.formFields}>
                      <Input
                        label="Voter Wallet Address"
                        name="address"
                        placeholder="0x..."
                        value={voterForm.address}
                        onChange={handleVoterChange}
                        required
                      />
                      <Input
                        label="Voter Name"
                        name="name"
                        placeholder="Full name"
                        value={voterForm.name}
                        onChange={handleVoterChange}
                        required
                      />
                      <Input
                        label="Image URL"
                        name="image"
                        placeholder="https://... (optional)"
                        value={voterForm.image}
                        onChange={handleVoterChange}
                      />
                    </div>
                    <div className={styles.formActions}>
                      <Button type="submit" loading={loading} fullWidth>
                        Whitelist Voter
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {/* Election Tab */}
              {activeTab === "election" && (
                <>
                  <div className={styles.formTitle}>🗓️ Create / Update Election</div>
                  {electionDetails && (
                    <div className="alert" style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", color: "var(--accent)", marginBottom: "1rem", fontSize: "0.85rem" }}>
                      Current: <strong>{electionDetails.title}</strong> — {electionDetails.organization}
                    </div>
                  )}
                  <form onSubmit={handleElectionSubmit}>
                    <div className={styles.formFields}>
                      <Input
                        label="Election Title"
                        name="title"
                        placeholder="e.g. General Election 2026"
                        value={electionForm.title}
                        onChange={handleElectionChange}
                        required
                      />
                      <Input
                        label="Organization"
                        name="organization"
                        placeholder="e.g. Government of India"
                        value={electionForm.organization}
                        onChange={handleElectionChange}
                        required
                      />
                      <Input
                        label="Start Date & Time"
                        name="startTime"
                        type="datetime-local"
                        value={electionForm.startTime}
                        onChange={handleElectionChange}
                        required
                      />
                      <Input
                        label="End Date & Time"
                        name="endTime"
                        type="datetime-local"
                        value={electionForm.endTime}
                        onChange={handleElectionChange}
                        required
                      />
                    </div>
                    <div className={styles.formActions}>
                      <Button type="submit" loading={loading} fullWidth>
                        {electionDetails ? "Update Election" : "Create Election"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* ── Registered Voters List ─────────────────────────────────────── */}
            <div className={styles.listPanel}>
              <div className={styles.listTitle}>
                Whitelisted Voters
                <span className={styles.countBadge}>{voterArray.length}</span>
              </div>
              <div className={styles.listItems}>
                {voterArray.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>
                    No voters whitelisted yet
                  </p>
                ) : (
                  voterArray.map((v) => (
                    <div key={v.voterId} className={styles.listItem}>
                      <div className={styles.listItemAvatar}>
                        {v.image ? <img src={v.image} alt={v.name} /> : "👤"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.listItemName}>{v.name}</div>
                        <div className={styles.listItemMeta}>
                          {`${v.voterAddress.slice(0, 8)}...${v.voterAddress.slice(-4)}`}
                        </div>
                      </div>
                      {v.voted ? (
                        <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>Voted</span>
                      ) : (
                        <span className="badge badge-accent" style={{ fontSize: "0.7rem" }}>Eligible</span>
                      )}
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

export default AllowedVoters;
