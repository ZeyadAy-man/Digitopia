import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../../../Service/authService";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get("token");

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handlePasswordReset = useCallback(
    async (resetToken, newPassword) => {
      if (
        newPassword.length < 8 ||
        !/[a-zA-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        setStatus("error");
        setMessage(
          "Password must be at least 8 characters long and include at least one letter and one number."
        );
        return;
      }

      if (!resetToken) {
        setStatus("error");
        setMessage("Token is required");
        return;
      }

      setStatus("submitting");
      setMessage("");

      try {
        const { success, error } = await resetPassword(resetToken, {
          password: newPassword,
        });

        if (success) {
          setStatus("success");
          setMessage(
            "Your password has been successfully reset. You can now log in with your new password."
          );

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(
            error ||
              "Failed to reset your password. The reset link may have expired."
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    },
    [navigate]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await handlePasswordReset(token, password);
    },
    [token, password, handlePasswordReset]
  );

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  return (
    <div className={styles.resetPasswordPage}>
      <div className={styles.resetPasswordContainer}>
        <h2>Reset Your Password</h2>

        {status === "success" ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <p>{message}</p>
            <p className={styles.redirectText}>Redirecting to login page...</p>
          </div>
        ) : (
          <>
            <p className={styles.instructions}>
              Please enter the token and your new password below.
            </p>

            <form className={styles.resetPasswordForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Reset code"
                  disabled={status === "submitting"}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.inputIcon}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  disabled={status === "submitting"}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash
                    className={`${styles.icon} ${styles.eyeIcon}`}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className={`${styles.icon} ${styles.eyeIcon}`}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>

              {status === "error" && (
                <div className={styles.errorMessage}>{message}</div>
              )}

              <button
                type="submit"
                className={styles.resetBtn}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
