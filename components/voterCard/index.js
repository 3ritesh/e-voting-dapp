import React from "react";
import styles from "./voterCard.module.css";

const VoterCard = ({ voter }) => {
    const truncate = (addr) =>
        addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : "";

    return (
        <div className={styles.card}>
            {/* Avatar */}
            <div className={styles.avatarWrapper}>
                {voter.image ? (
                    <img src={voter.image} alt={voter.name} />
                ) : (
                    <span>👤</span>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <div className={styles.name}>{voter.name || "Anonymous"}</div>
                <div className={styles.address}>{truncate(voter.voterAddress)}</div>
            </div>

            {/* Status */}
            <div className={styles.status}>
                {voter.voted ? (
                    <span className="badge badge-success">✅ Voted</span>
                ) : voter.allowed === 1 ? (
                    <span className="badge badge-accent">⏳ Eligible</span>
                ) : (
                    <span className="badge badge-warning">❌ Not Eligible</span>
                )}
                <span className={styles.voterId}>ID #{voter.voterId}</span>
            </div>
        </div>
    );
};

export default VoterCard;
