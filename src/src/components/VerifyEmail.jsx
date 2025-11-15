import React, { useState, useEffect, useRef } from 'react';
import auth from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Get email from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.email) {
            setEmail(user.email);
        }
    }, []);

    const handleInputChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError("");
        setSuccess("");

        // Auto-focus to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setCode(digits);
            setError("");
            setSuccess("");
            // Focus the last input
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const codeString = code.join("");
        if (codeString.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        if (!email) {
            setError("Email not found. Please sign up again.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await auth.verifyAccount(email, codeString);
            setSuccess(response.data.message || "Email verified successfully!");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center md:max-w-[423px] w-[380px] bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            <p className="text-2xl font-semibold text-gray-900">Email Verify OTP</p>

            <p className="mt-2 text-sm text-gray-900/90 text-center">
                Enter the 6-digit code sent to your email ID.
            </p>

            {email && (
                <p className="mt-1 text-xs text-gray-600 text-center">
                    {email}
                </p>
            )}

            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-6 gap-2 sm:gap-3 w-11/12 mt-8 mx-auto">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-full h-12 bg-indigo-50 text-gray-900 text-xl rounded-md outline-none text-center focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                        />
                    ))}
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
                )}

                {success && (
                    <p className="mt-4 text-sm text-green-600 text-center">{success}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || code.join("").length !== 6}
                    className="mt-8 w-full max-w-80 h-11 rounded-full text-white text-sm bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </form>
        </div>
    );
};

export default VerifyEmail;
