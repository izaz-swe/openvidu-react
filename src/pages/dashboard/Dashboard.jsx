import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OpenVidu-Style Login Page
 * --------------------------------------------------------
 * Drop this component into any React app that has Tailwind CSS enabled.
 *
 * Props (all optional):
 * - backgroundUrl: string (image url for the full-screen background)
 * - title: string (main brand/title)
 * - subtitle: string (tagline under the brand)
 * - version: string (bottom-right small text)
 * - photoCredit: { label: string, href: string } (bottom-left credit)
 * - onSubmit: (credentials) => void | Promise<void>
 */
export default function Dashboard({
  backgroundUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop",
  title = "C3bit Meet",
  subtitle = "Videoconference rooms in one click",
  version = "3.3.0",
  photoCredit = {
    label: "Daniel Leone on Unsplash",
    href: "https://unsplash.com",
  },
}) {
  const [roomName, setRoomName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(roomName);
      
      navigate(`/room/${roomName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        aria-hidden="true"
      />
      {/* Soft vignette + tint */}
      <div className="absolute inset-0 bg-slate-900/40" aria-hidden="true" />

      {/* Page content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Brand */}
        <div className="flex flex-col items-center gap-6 -mt-24 md:-mt-12 select-none">
          <LogoMark className="h-16 w-16 text-emerald-400 drop-shadow" />
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-slate-200/90 text-xl text-center max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-2xl"
          autoComplete="off"
        >
          <div className="flex flex-col gap-4">
            {/* roomName */}
            <div className="flex overflow-hidden rounded-xl bg-slate-800/80 backdrop-blur ring-1 ring-white/10">
              <div className="grid place-items-center px-4 text-slate-300">
                <UserIcon className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="room-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-transparent px-3 py-4 text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex overflow-hidden rounded-xl bg-slate-800/80 backdrop-blur ring-1 ring-white/10">
              <div className="grid place-items-center px-4 text-slate-300">
                <UserIcon className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="participant name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full bg-transparent px-3 py-4 text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-cyan-900/70 px-6 py-3 text-slate-100 ring-1 ring-white/15 transition hover:bg-cyan-800/70 focus:outline-none disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Join"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="pointer-events-none absolute bottom-4 left-4 text-xs text-slate-200/80">
          Photo by{" "}
          {photoCredit?.href ? (
            <a
              href={photoCredit.href}
              className="underline pointer-events-auto"
              target="_blank"
              rel="noreferrer"
            >
              {photoCredit.label}
            </a>
          ) : (
            photoCredit?.label
          )}
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-slate-200/80">
          {version}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Icons & Logo ---------------------------- */
function LogoMark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="10" width="42" height="34" rx="8" fill="currentColor" />
      <path d="M23 26l14 8-14 8V26z" fill="#0ea5e9" />
      <rect
        x="16"
        y="34"
        width="28"
        height="20"
        rx="4"
        fill="#22c55e"
        opacity=".9"
      />
    </svg>
  );
}

function UserIcon({ className = "" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 20a10 10 0 1120 0H2z" />
    </svg>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V11a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z" />
    </svg>
  );
}
