import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setLocation("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setLocation]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#06060A] text-white p-4">
      <div className="text-center max-w-md">
        {/* Glowing 404 */}
        <div className="relative mb-6">
          <p className="text-[120px] font-extrabold leading-none tracking-tighter text-white/5 select-none absolute inset-0 flex items-center justify-center blur-sm">
            404
          </p>
          <p className="text-[120px] font-extrabold leading-none tracking-tighter text-white/10 select-none relative">
            404
          </p>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-[#6E6E73] text-sm mb-8 leading-relaxed">
          This page doesn't exist or has been moved.
          <br />
          Redirecting you home in{" "}
          <span className="text-blue-400 font-bold tabular-nums">{countdown}s</span>…
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/10 text-sm font-medium text-white/70 hover:text-white hover:border-white/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
