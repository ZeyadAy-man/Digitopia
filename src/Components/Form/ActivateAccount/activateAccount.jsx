import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { activateAccount } from "../../../Service/authService";
import styles from "./ActivateAccount.module.css";
import { useLocation, useNavigate } from "react-router-dom";

function ActivationModal({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get("token");

  const [tokens, setTokens] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleActivation = useCallback(
    async (token) => {
      if (!token?.trim()) {
        setStatus("error");
        setMessage("Please enter the activation code.");
        return;
      }

      setStatus("verifying");
      setMessage("Verifying your account...");

      try {
        const { success, error } = await activateAccount(token);

        if (success) {
          setStatus("success");
          setMessage(
            "Your account has been successfully activated! You can now log in."
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(
            error?.message ||
              "Failed to activate your account. Please check the code."
          );
        }
      } catch (error) {
        console.error("Activation error:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (tokenFromUrl) {
      setTokens(tokenFromUrl);
      handleActivation(tokenFromUrl);
    }
  }, [tokenFromUrl, handleActivation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleActivation(tokens);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.activateTitle}>Account Activation</h2>
        <p className={styles.activateDescription}>
          {tokenFromUrl
            ? "We're verifying your account..."
            : "Please check your email for the activation code we sent you."}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Enter activation code"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            className={styles.inputField}
            autoFocus={!tokenFromUrl}
            disabled={status === "verifying"}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={status === "verifying" || !tokens.trim()}
          >
            {status === "verifying" ? "Verifying..." : "Verify"}
          </button>
        </form>

        {message && (
          <p
            className={
              status === "verifying"
                ? styles.verifying
                : status === "success"
                ? styles.success
                : styles.error
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

ActivationModal.propTypes = {
  onClose: PropTypes.func,
};

export default ActivationModal;
