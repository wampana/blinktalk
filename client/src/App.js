import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import LandingPage from "./LandingPage";

const SOCKET_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const socket = io(SOCKET_URL);

function App() {
  // Controls which screen is shown: 'landing' or 'chat'
  const [page, setPage] = useState("landing");
  const [isSearching, setIsSearching] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const streamRef = useRef(null);
  const peerRef = useRef(null);
  const matchIdRef = useRef(null);
  // Tracks the current connection session — incremented on every Next/disconnect
  // so that stale signals from old sessions are ignored
  const connectionIdRef = useRef(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (myVideo.current) myVideo.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));

    socket.on("match-found", ({ initiator, matchId }) => {
      // Snapshot this session's ID so stale events can be detected
      const sessionId = connectionIdRef.current;
      matchIdRef.current = matchId;

      if (!streamRef.current) {
        console.warn("Stream not ready yet — cannot create peer");
        return;
      }

      const newPeer = new Peer({
        initiator,
        trickle: false,
        stream: streamRef.current,
      });

      newPeer.on("signal", (data) => {
        // Only send if this session is still active
        if (connectionIdRef.current === sessionId) {
          socket.emit("signal", { matchId: matchIdRef.current, signal: data });
        }
      });

      newPeer.on("stream", (remoteStream) => {
        if (connectionIdRef.current === sessionId && userVideo.current) {
          userVideo.current.srcObject = remoteStream;
          setIsSearching(false);
        }
      });

      // Prevent unhandled errors from crashing the app
      newPeer.on("error", (err) => {
        console.error("Peer error:", err.message);
      });

      peerRef.current = newPeer;
    });

    socket.on("signal", (data) => {
      if (!data || data.matchId !== matchIdRef.current) return;
      // Only forward signal if the peer is alive (not destroyed)
      if (peerRef.current && !peerRef.current.destroyed) {
        try {
          peerRef.current.signal(data.signal);
        } catch (err) {
          console.error("Signal error:", err.message);
        }
      }
    });

    socket.on("partner-disconnected", () => {
      // Invalidate the current session so stale events are dropped
      connectionIdRef.current += 1;
      peerRef.current?.destroy();
      peerRef.current = null;
      matchIdRef.current = null;
      if (userVideo.current) userVideo.current.srcObject = null;
      setIsSearching(true);
    });

    return () => {
      socket.off("match-found");
      socket.off("signal");
      socket.off("partner-disconnected");
    };
  }, []);

  useEffect(() => {
    if (page === "chat") {
      if (streamRef.current && myVideo.current) {
        myVideo.current.srcObject = streamRef.current;
      }
      setIsSearching(true);
      socket.emit("find-match");
    }
  }, [page]);

  const start = () => {
    setIsSearching(true);
    socket.emit("find-match");
  };

  const destroyCurrentPeer = () => {
    // Increment session ID to invalidate any in-flight signals
    connectionIdRef.current += 1;
    peerRef.current?.destroy();
    peerRef.current = null;
    matchIdRef.current = null;
    if (userVideo.current) userVideo.current.srcObject = null;
  };

  const next = () => {
    destroyCurrentPeer();
    setIsSearching(true);
    socket.emit("next");
  };

  const endCall = () => {
    destroyCurrentPeer();
    setIsSearching(false);
    socket.emit("leave-chat");
    setPage("landing");
  };

  const toggleMic = () => {
    const stream = streamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  const toggleCam = () => {
    const stream = streamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setCamOn(videoTrack.enabled);
  };

  // If on landing page, render it and pass onStart to switch to chat
  if (page === "landing") {
    return (
      <LandingPage
        onStart={() => {
          setPage("chat");
          // Request camera access as soon as user navigates to chat
        }}
      />
    );
  }

  return (
    <div className="dark text-on-surface font-body-base">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 md:px-12 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">
          BlinkTalk
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">LIVE</span>
          </div>
          <div className="flex gap-4">
            <button type="button" className="material-symbols-outlined text-gray-400 hover:text-purple-300 transition-all scale-105 duration-200">account_circle</button>
            <button type="button" className="material-symbols-outlined text-gray-400 hover:text-purple-300 transition-all scale-105 duration-200">settings</button>
          </div>
        </div>
      </header>

      <main className="fixed inset-0 z-0">
        <div className="w-full h-full relative bg-black">
          <video ref={userVideo} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
          <div className="absolute bottom-24 left-10 flex flex-col gap-1">
            <span className="font-headline-md text-headline-md text-white drop-shadow-lg">Stranger</span>
            <div className="flex items-center gap-2 text-white/70">
              <span className="material-symbols-outlined text-sm">videocam</span>
              <span className="font-body-sm text-body-sm">Connected with BlinkTalk</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed top-24 right-10 z-30 w-48 md:w-64 aspect-[3/4] rounded-lg overflow-hidden glass-panel shadow-2xl ring-1 ring-white/20 bg-black">
        <video ref={myVideo} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <span className="font-label-caps text-[10px] text-white">YOU</span>
        </div>
      </div>

      <div className="fixed bottom-safe-area left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6">
        <div className="glass-panel rounded-full p-gutter flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-2">
            <button type="button" onClick={toggleMic} className="w-12 h-12 rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-all" title="Mute Mic">
              <span className="material-symbols-outlined">{micOn ? "mic" : "mic_off"}</span>
            </button>
            <button type="button" onClick={toggleCam} className="w-12 h-12 rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-all" title="Toggle Camera">
              <span className="material-symbols-outlined">{camOn ? "videocam" : "videocam_off"}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-white/70 text-sm px-3">
              <span className="material-symbols-outlined text-base">{isSearching ? "sync" : "check_circle"}</span>
              <span>{isSearching ? "Finding partner..." : "Connected"}</span>
            </div>
            <button type="button" onClick={start} className="hidden lg:flex px-5 py-3 bg-white/10 rounded-full text-white font-title-sm items-center gap-2 hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">search</span>
              Start
            </button>
            <button type="button" onClick={next} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full text-white font-title-sm text-title-sm flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all">
              <span>NEXT</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button type="button" onClick={endCall} className="w-14 h-14 bg-error-container rounded-full flex items-center justify-center text-on-error-container hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)]" title="End Call">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call_end</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2">
            <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center text-white/50 hover:text-error hover:bg-white/10 transition-all" title="Report">
              <span className="material-symbols-outlined">report</span>
            </button>
          </div>
        </div>
      </div>

      <button type="button" className="fixed bottom-safe-area right-10 z-40 w-14 h-14 glass-panel rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-all shadow-lg">
        <span className="material-symbols-outlined">chat_bubble</span>
      </button>

      <div className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 z-40 flex-col gap-6">
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center gap-4 border border-white/5">
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <span className="material-symbols-outlined text-purple-400">auto_awesome</span>
            </div>
            <span className="font-label-caps text-[10px] text-white/60">EFFECTS</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <span className="material-symbols-outlined text-purple-400">group_add</span>
            </div>
            <span className="font-label-caps text-[10px] text-white/60">INVITE</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <span className="material-symbols-outlined text-purple-400">gamepad</span>
            </div>
            <span className="font-label-caps text-[10px] text-white/60">GAMES</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-safe-area left-10 z-40 hidden md:flex items-center gap-2 px-3 py-2 glass-panel rounded-full text-white/50">
        <span className="material-symbols-outlined text-sm text-green-400">signal_cellular_4_bar</span>
        <span className="font-label-caps text-[10px] tracking-widest">HD CONNECTION</span>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <button type="button" onClick={start} className="px-6 py-3 rounded-full bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          Start Match
        </button>
      </div>
    </div>
  );
}

export default App;
