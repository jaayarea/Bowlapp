@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  body {
    @apply bg-[#050505] text-white min-h-screen overflow-x-hidden;
  }
}

@keyframes neon-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
    border-color: rgba(168, 85, 247, 0.8);
  }
  50% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3);
    border-color: rgba(34, 197, 94, 0.8);
  }
}

.neon-border {
  border: 2px solid;
  animation: neon-pulse 4s infinite;
}

.neon-text {
  text-shadow: 0 0 10px currentColor;
}

@keyframes rotate-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-neon-gradient {
  background: linear-gradient(-45deg, #a855f7, #7c3aed, #22c55e, #16a34a);
  background-size: 400% 400%;
  animation: rotate-gradient 15s ease infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #050505;
}
::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.5);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(24, 24, 27, 0.5);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.5);
}
