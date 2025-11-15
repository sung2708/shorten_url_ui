import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../../../api/auth";
import { AuthContext } from "../../../context/AuthContext.jsx";

const SigninForm = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

    const { authenticate } = useContext(AuthContext);

    const validateForm = (data) => {
        if (!data.password || data.password.length < 8) {
            return "Passwords must contain at least 8 characters";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const clientErr = validateForm(formData);

        if (clientErr) {
            setError(clientErr);
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const res = await auth.loginUser(formData.email, formData.password);
            authenticate(res.data.token, res.data.user);
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center  text-white bg-white bg-no-repeat bg-cover bg-center">
            <div className="">
                <div className="w-full flex flex-col items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="md:w-96 w-80 flex flex-col items-center justify-center"
                    >
                        {error && (
                            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 mb-4">
                                {error}
                            </div>
                        )}
                        <button
                            type="button"
                            disabled={loading}
                            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img
                                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                                alt="googleLogo"
                            />
                        </button>

                        <div className="flex items-center gap-4 w-full my-5">
                            <div className="w-full h-px bg-gray-300/90"></div>

                            <p className="w-full text-nowrap text-sm text-gray-500/90">
                                or sign in with email
                            </p>

                            <div className="w-full h-px bg-gray-300/90"></div>
                        </div>

                        <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg
                                width="16"
                                height="11"
                                viewBox="0 0 16 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                    fill="#6B7280"
                                />
                            </svg>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full disabled:opacity-50"
                                required
                            />
                        </div>

                        <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg
                                width="13"
                                height="17"
                                viewBox="0 0 13 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                    fill="#6B7280"
                                />
                            </svg>

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full disabled:opacity-50"
                                required
                            />
                        </div>

                        <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                            <a className="text-sm underline" href="#">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>{" "}
        </div>
    );
};

export default SigninForm;
