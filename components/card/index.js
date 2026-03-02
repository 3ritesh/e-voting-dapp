import React, { useContext } from "react";
import { VoterContext } from "../../context/Voter";
import styles from "./card.module.css";

const CandidateCard = ({ candidate, totalVotes, index }) => {
    const { vote, currentVoter, electionDetails } = useContext(VoterContext);

    const isVotingActive =
        electionDetails &&
        Date.now() / 1000 >= electionDetails.startTime &&
        Date.now() / 1000 <= electionDetails.endTime;

    const hasVoted = currentVoter && currentVoter.voted;
    const isAllowed = currentVoter && currentVoter.allowed === 1;
    const votedFor = hasVoted && currentVoter.vote === candidate.candidateId;

    const progressPercent =
        totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;

    const truncate = (addr) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    const handleVote = () => {
        if (!isVotingActive || hasVoted || !isAllowed) return;
        vote(candidate.address);
    };

    const getBtnState = () => {
        if (votedFor) return "voted";
        if (!isVotingActive || hasVoted || !isAllowed) return "inactive";
        return "canVote";
    };

    const getBtnLabel = () => {
        if (votedFor) return "✅ Voted";
        if (hasVoted) return "Already Voted";
        if (!isAllowed) return "Not Eligible";
        if (!isVotingActive) return "Voting Closed";
        return "🗳️ Vote";
    };

    return (
        <div className={styles.card}>
            <div className={styles.rank}>#{index + 1}</div>

            {/* Image */}
            <div className={styles.imageWrapper}>
                {candidate.image ? (
                    <img src={candidate.image} alt={candidate.name} />
                ) : (
                    <div className={styles.avatarPlaceholder}>🧑‍💼</div>
                )}
            </div>

            {/* Body */}
            <div className={styles.body}>
                <div className={styles.name}>{candidate.name}</div>

                <div className={styles.meta}>
                    <span className={styles.metaItem}>🎂 Age: {candidate.age}</span>
                    <span className={styles.metaItem}>🆔 ID: #{candidate.candidateId}</span>
                </div>

                {/* Vote Count */}
                <div className={styles.voteSection}>
                    <div className={styles.voteLabel}>
                        <span>Votes</span>
                        <span className={styles.voteCount}>{candidate.voteCount}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                        {progressPercent}% of total votes
                    </div>
                </div>

                {/* Address */}
                <div className={styles.address}>{truncate(candidate.address)}</div>

                {/* Vote Button */}
                <button
                    className={`${styles.voteBtn} ${styles[getBtnState()]}`}
                    onClick={handleVote}
                >
                    {getBtnLabel()}
                </button>
            </div>
        </div>
    );
};

export default CandidateCard;
