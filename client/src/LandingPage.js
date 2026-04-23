import React from "react";

// Landing page for BlinkTalk — shown before the user starts a video chat
function LandingPage({ onStart }) {
  return (
    <div className="dark font-body-base">
      {/* ── Top Navigation Bar ── */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 md:px-12 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="flex items-center gap-4">
          <span className="font-['Space_Grotesk'] tracking-tight text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            BlinkTalk
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button type="button" className="font-['Space_Grotesk'] tracking-tight text-purple-400 border-b-2 border-purple-500 hover:text-purple-300 transition-all">Home</button>
          <button type="button" className="font-['Space_Grotesk'] tracking-tight text-gray-400 hover:text-purple-300 transition-all">Explore</button>
          <button type="button" className="font-['Space_Grotesk'] tracking-tight text-gray-400 hover:text-purple-300 transition-all">About</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-gray-400 hover:text-purple-300 transition-all">account_circle</button>
          <button className="material-symbols-outlined text-gray-400 hover:text-purple-300 transition-all">settings</button>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="relative pt-24 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]"></div>
        </div>

        {/* Hero content */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Brand title */}
          <div className="mb-8">
            <h1 className="font-['Space_Grotesk'] text-[80px] md:text-[120px] font-black bg-gradient-to-b from-white via-purple-300 to-purple-600 bg-clip-text text-transparent tracking-tighter leading-none neon-glow">
              BlinkTalk
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[32px] font-['Space_Grotesk'] font-semibold text-white mb-12 max-w-2xl mx-auto">
            Talk to someone new. <span className="text-purple-400">Instantly.</span>
          </p>

          {/* CTA Button — calls onStart to open the video chat */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={onStart}
              className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white font-semibold text-[20px] shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all scale-100 hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
              Start Video Chat
            </button>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">lock</span>
              No signup required
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-purple-400">bolt</span>
              </div>
              <h3 className="text-[20px] font-['Inter'] font-semibold mb-2">Zero Latency</h3>
              <p className="text-[14px] font-['Inter'] text-[#cfc2d6]">Powered by cutting-edge WebRTC for instantaneous global connections.</p>
            </div>

            {/* Feature 2 — highlighted, slightly elevated */}
            <div className="glass-panel p-8 rounded-lg md:scale-110 md:-translate-y-4 border-purple-500/30">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-400">shield_person</span>
              </div>
              <h3 className="text-[20px] font-['Inter'] font-semibold mb-2">End-to-End Privacy</h3>
              <p className="text-[14px] font-['Inter'] text-[#cfc2d6]">Your identity stays yours. No data tracking, no logs, just pure human connection.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-pink-400">groups</span>
              </div>
              <h3 className="text-[20px] font-['Inter'] font-semibold mb-2">Global Community</h3>
              <p className="text-[14px] font-['Inter'] text-[#cfc2d6]">Join millions from 190+ countries. Diversity is just one click away.</p>
            </div>
          </div>
        </section>

        {/* Decorative floating video card — left */}
        <div className="hidden lg:block absolute left-10 bottom-24 w-64 h-80 glass-panel p-2 rounded-lg -rotate-6 opacity-40">
          <div className="w-full h-full rounded-md overflow-hidden relative">
            <img
              className="w-full h-full object-cover"
              alt="portrait of a young woman smiling in a neon-lit urban environment"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUEf6UPDcZnaWAsmoev5RovtdWS0PalNSwqo-9k-I7Hyi5qQO9uo-1kmAfttP5mb1z0NvdlzZN2Q7SOHBOvntIRwGumheGl2wZJjrzRasRFDnJOFNUQG-ee9LBflz8S2sxBu6uKaro0FxU2SeP6qHzs1i0clrQleE8M-o_d0YiTF6Oqk3FTymCEhTUcKI59Lo558wlj_1X3ZigV97sBxYIh7ZwFd0sipiheiGh_6UcTHQ390zgXHivptHioYcKfP46ad4dutQI3fA"
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold">LIVE</div>
          </div>
        </div>

        {/* Decorative floating video card — right */}
        <div className="hidden lg:block absolute right-10 bottom-40 w-64 h-80 glass-panel p-2 rounded-lg rotate-12 opacity-40">
          <div className="w-full h-full rounded-md overflow-hidden relative">
            <img
              className="w-full h-full object-cover"
              alt="close-up portrait of a man looking thoughtfully into the camera"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOJdkyYeaqHhgLeRLCL6o40LchP1yWlkecDobOa-sk7YbSonCs8iQ1_wZS9LGmhR6cM3-tJTuzTckaLEiPyZz2Vi_nPR_JWPdMQp7sicjhgjQ49-t13B4woJpXHJMosKPuYWXtxe1gl0WTZ9FNOJwqvrmd2P099NgAHeoAtnleF0lTOuJrYE2QFPzRqWvrMffCHuZTakoL_EvWD80zAKvd-kPDR9pdx_tLLTp5fbhSLAN0hlmyqmbRtqJqhMX9rpvrpl4lSPsuc70"
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold">LIVE</div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-12 border-t border-white/5 bg-black">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-8">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-black text-white">BlinkTalk</span>
            <p className="font-['Space_Grotesk'] text-sm uppercase tracking-widest text-gray-500">© 2024 BlinkTalk. Futuristic connectivity.</p>
          </div>
          <nav className="flex gap-8">
            {["Privacy", "Terms", "Support", "Community"].map((link) => (
              <button type="button" key={link} className="font-['Space_Grotesk'] text-sm uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                {link}
              </button>
            ))}
          </nav>
          <div className="flex gap-4 items-center">
            <span className="material-symbols-outlined text-purple-500">language</span>
            <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest text-purple-500">EN-US</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
