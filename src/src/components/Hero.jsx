import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import url from "../../api/url";
import { assets } from "../assets/assets";

const Hero = () => {
    const [shortUrlData, setShortUrlData] = useState(null);
    const [longURL, setLongURL] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const qrCodeRef = useRef(null);

    const { isLogined } = useContext(AuthContext);

    const validateURL = (urlString) => {
        try {
            const url = new URL(urlString);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate URL
        if (!longURL.trim()) {
            setError("Please enter a URL");
            return;
        }

        // Add protocol if missing
        let urlToShorten = longURL.trim();
        if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
            urlToShorten = "https://" + urlToShorten;
        }

        if (!validateURL(urlToShorten)) {
            setError("Please enter a valid URL");
            return;
        }

        setLoading(true);
        try {
            const response = await url.getShortcode(urlToShorten);
            const data = response.data;

            // Ensure the shortened URL has a protocol
            let shortUrl = data.url;
            if (shortUrl) {
                // If URL already has protocol, keep it as is
                if (shortUrl.startsWith("http://") || shortUrl.startsWith("https://")) {
                    // URL already has protocol, use as is
                } else {
                    // Check if it's localhost or relative path
                    if (shortUrl.includes("localhost") || shortUrl.startsWith("127.0.0.1")) {
                        shortUrl = "http://" + shortUrl;
                    } else {
                        // For other URLs, try to preserve the original protocol or default to https
                        const originalProtocol = urlToShorten.startsWith("http://") ? "http://" : "https://";
                        shortUrl = originalProtocol + shortUrl;
                    }
                }
            }

            setShortUrlData({
                short: shortUrl,
                long: data.longURL || urlToShorten,
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to shorten URL. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const shortenText = (text, maxLength = 30) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const handleCopy = async (text) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            const toast = document.createElement("div");
            toast.textContent = "Copied to clipboard!";
            toast.style.position = "fixed";
            toast.style.bottom = "30px";
            toast.style.right = "30px";
            toast.style.background = "#4ade80";
            toast.style.color = "#fff";
            toast.style.padding = "8px 16px";
            toast.style.borderRadius = "8px";
            toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
            toast.style.zIndex = "9999";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const handleInputChange = (e) => {
        setLongURL(e.target.value);
        if (error) {
            setError(null);
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeRef.current) return;

        try {
            const svg = qrCodeRef.current.querySelector('svg');
            if (!svg) return;
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `qrcode-${shortUrlData.short.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                });
            };

            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        } catch (err) {
            console.error("Failed to download QR code:", err);
            const toast = document.createElement("div");
            toast.textContent = "Failed to download QR code";
            toast.style.position = "fixed";
            toast.style.bottom = "30px";
            toast.style.right = "30px";
            toast.style.background = "#ef4444";
            toast.style.color = "#fff";
            toast.style.padding = "8px 16px";
            toast.style.borderRadius = "8px";
            toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
            toast.style.zIndex = "9999";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }
    };

    const copyQRCode = async () => {
        if (!qrCodeRef.current) return;

        try {
            const svg = qrCodeRef.current.querySelector('svg');
            if (!svg) return;
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ "image/png": blob })
                        ]);
                        const toast = document.createElement("div");
                        toast.textContent = "QR code copied to clipboard!";
                        toast.style.position = "fixed";
                        toast.style.bottom = "30px";
                        toast.style.right = "30px";
                        toast.style.background = "#4ade80";
                        toast.style.color = "#fff";
                        toast.style.padding = "8px 16px";
                        toast.style.borderRadius = "8px";
                        toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
                        toast.style.zIndex = "9999";
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                    } catch (err) {
                        console.error("Failed to copy QR code:", err);
                        const toast = document.createElement("div");
                        toast.textContent = "Failed to copy QR code";
                        toast.style.position = "fixed";
                        toast.style.bottom = "30px";
                        toast.style.right = "30px";
                        toast.style.background = "#ef4444";
                        toast.style.color = "#fff";
                        toast.style.padding = "8px 16px";
                        toast.style.borderRadius = "8px";
                        toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
                        toast.style.zIndex = "9999";
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                    }
                });
            };

            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        } catch (err) {
            console.error("Failed to copy QR code:", err);
            const toast = document.createElement("div");
            toast.textContent = "Failed to copy QR code";
            toast.style.position = "fixed";
            toast.style.bottom = "30px";
            toast.style.right = "30px";
            toast.style.background = "#ef4444";
            toast.style.color = "#fff";
            toast.style.padding = "8px 16px";
            toast.style.borderRadius = "8px";
            toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
            toast.style.zIndex = "9999";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }
    };
    useEffect(() => {
        if (!isLogined) {
            setShortUrlData(null);
            setLongURL("");
            setError(null);
        }
    }, [isLogined]);
    return (
        <div className='flex flex-col items-center justify-center h-screen text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center'>
            <h4 className="font-family text-xl md:text-3xl md:text-[48px] md:leading-[48px] font-bold md:font-extrabold max-w-xl m-2">
                Shorten & Track Your URLs
            </h4>

            {!isLogined ? (
                <p className="max-w-130 m-2 text-sm md:text-base font-medium">
                    Shorten instantly. Log In to track clicks and control your links from
                    a private dashboard. Transform your URLs into data assets—
                    <b className="text-bl">
                        <i>
                            <Link className="text-blue-700 hover:underline" to="/auth?mode=signup">
                                Sign Up
                            </Link>{" "}
                            Now!
                        </i>
                    </b>
                </p>
            ) : (
                <div className="mt-2"></div>
            )}
            <div className="text-gray-900 bg-blue-200/90 mx-auto max-w-xl md:p-10 p-8 text-center text-sm rounded-2xl shadow-[0px_0px_10px_0px] shadow-black/10 opacity-70 ml-4 mr-4">
                {shortUrlData ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
                            Shorten URL
                        </h2>

                        <div className="space-y-3">
                            <p className="flex items-center justify-center flex-wrap gap-2">
                                <span>Shorten URL:</span>
                                <a
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium break-all cursor-pointer"
                                    href={shortUrlData.short}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {shortUrlData.short}
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCopy(shortUrlData.short);
                                    }}
                                    className="text-gray-600 hover:text-gray-800"
                                    title="Copy shorten URL"
                                >
                                    <img
                                        src={assets.clipboardIcon}
                                        alt="Copy"
                                        className="inline w-3 h-3 cursor-pointer hover:opacity-75"
                                    />
                                </button>
                            </p>

                            <p>
                                Original URL:{" "}
                                <a
                                    className="text-blue-500 hover:underline"
                                    href={shortUrlData.long}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {shortenText(shortUrlData.long, 40)}
                                </a>{" "}
                                <button
                                    onClick={() => handleCopy(shortUrlData.long)}
                                    className="ml-2 text-gray-600 hover:text-gray-800"
                                    title="Copy original URL"
                                >
                                    <img
                                        src={assets.clipboardIcon}
                                        alt="Copy"
                                        className="inline w-3 h-3 cursor-pointer hover:opacity-75"
                                    />
                                </button>
                            </p>

                            {/* QR Code Section */}
                            <div className="flex flex-col items-center mt-6 pt-6 border-t border-gray-300">
                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    Scan QR Code
                                </p>
                                <div className="bg-white p-4 rounded-lg shadow-md" ref={qrCodeRef}>
                                    <QRCodeSVG
                                        value={shortUrlData.short}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                                {/* QR Code Actions */}
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={copyQRCode}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors text-sm font-medium"
                                        title="Copy QR code image"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Copy QR
                                    </button>
                                    <button
                                        onClick={downloadQRCode}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors text-sm font-medium"
                                        title="Download QR code image"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                        </svg>
                                        Download
                                    </button>
                                </div>


                            </div>

                            <button
                                onClick={() => {
                                    setShortUrlData(null);
                                    setLongURL("");
                                    setError(null);
                                }}
                                className="rounded-full w-full mt-4 bg-gray-400 py-2.5 text-gray-900 hover:bg-gray-600 cursor-pointer"
                            >
                                Shorten Another URL
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
                            Shorten Your URL Here
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="url-form" className="font-semibold">
                                URL
                            </label>

                            {error && (
                                <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
                                    {error}
                                </div>
                            )}

                            <input
                                id="url-form"
                                className="rounded-full text-gray-900 w-full border mt-1 border-gray-500 hover:border-white outline-none py-2.5 px-4 disabled:opacity-50"
                                type="text"
                                value={longURL}
                                onChange={handleInputChange}
                                placeholder="e.g., https://example.com/very/long/link"
                                disabled={loading}
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-full w-full my-3 bg-gray-500 active:scale-95 transition py-2.5 text-gray-900 hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Shortening..." : "Get Short Link"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Hero;
