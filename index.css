import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Download, 
  User, 
  History,
  Trash2,
  Undo2,
  UserPlus,
  UserMinus,
  Play
} from 'lucide-react';
import { PlayerState, BowlingGameState } from './types';
import { createNewPlayer, calculateScores, calculateMaxPossibleScore, formatFrameRolls } from './utils/bowlingLogic';

export default function App() {
  const [gameState, setGameState] = useState<BowlingGameState>({
    players: [createNewPlayer('Player 1')],
    activePlayerIndex: 0,
    currentFrameIndex: 0,
  });
  const [history, setHistory] = useState<PlayerState[][]>([]);
  const [showToast, setShowToast] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const activePlayer = gameState.players[gameState.activePlayerIndex];

  const isGameOver = useMemo(() => {
    return gameState.players.every(p => p.isGameOver);
  }, [gameState.players]);

  const handleRoll = (pins: number) => {
    if (isGameOver || !gameStarted) return;

    const newPlayers = [...gameState.players];
    const player = { ...newPlayers[gameState.activePlayerIndex] };
    const newRolls = [...player.rolls, pins];
    
    const { totalScore, frames, isGameOver: playerFinished } = calculateScores(newRolls);
    const maxPossible = calculateMaxPossibleScore(newRolls);

    player.rolls = newRolls;
    player.frames = frames;
    player.totalScore = totalScore;
    player.maxPossibleScore = maxPossible;
    player.isGameOver = playerFinished;

    newPlayers[gameState.activePlayerIndex] = player;

    // Determine if turn is over
    // A turn is over if the player finished the current frame
    const currentFrame = frames[gameState.currentFrameIndex];
    const isFrameComplete = currentFrame && currentFrame.isTurnComplete;

    let nextPlayerIdx = gameState.activePlayerIndex;
    let nextFrameIdx = gameState.currentFrameIndex;

    if (isFrameComplete && !isGameOver) {
      if (nextPlayerIdx < newPlayers.length - 1) {
        nextPlayerIdx++;
      } else {
        nextPlayerIdx = 0;
        nextFrameIdx++;
      }
    }

    setGameState({
      players: newPlayers,
      activePlayerIndex: nextPlayerIdx,
      currentFrameIndex: nextFrameIdx,
    });
  };

  const handleUndo = () => {
    // This is tricky with multi-player. Let's just undo the last roll of the current active player if possible, 
    // or go back to the previous player.
    // For simplicity, let's just allow undoing the very last roll in the global sequence.
    // But we don't track global sequence. Let's just undo the active player's last roll.
    const newPlayers = [...gameState.players];
    const player = { ...newPlayers[gameState.activePlayerIndex] };
    if (player.rolls.length === 0) return;

    const newRolls = player.rolls.slice(0, -1);
    const { totalScore, frames, isGameOver: playerFinished } = calculateScores(newRolls);
    const maxPossible = calculateMaxPossibleScore(newRolls);

    player.rolls = newRolls;
    player.frames = frames;
    player.totalScore = totalScore;
    player.maxPossibleScore = maxPossible;
    player.isGameOver = playerFinished;

    newPlayers[gameState.activePlayerIndex] = player;

    setGameState(prev => ({
      ...prev,
      players: newPlayers
    }));
  };

  const addPlayer = () => {
    if (gameState.players.length < 6 && !gameStarted) {
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, createNewPlayer(`Player ${prev.players.length + 1}`)]
      }));
    }
  };

  const removePlayer = (index: number) => {
    if (gameState.players.length > 1 && !gameStarted) {
      setGameState(prev => ({
        ...prev,
        players: prev.players.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...gameState.players];
    newPlayers[index].name = name;
    setGameState(prev => ({ ...prev, players: newPlayers }));
  };

  const handleReset = () => {
    setGameState({
      players: gameState.players.map(p => createNewPlayer(p.name)),
      activePlayerIndex: 0,
      currentFrameIndex: 0,
    });
    setGameStarted(false);
  };

  const saveToHistory = () => {
    setHistory(prev => [gameState.players, ...prev]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // Reset game without confirmation after saving
    setGameState({
      players: gameState.players.map(p => createNewPlayer(p.name)),
      activePlayerIndex: 0,
      currentFrameIndex: 0,
    });
    setGameStarted(false);
  };

  const exportScores = () => {
    const data = history.length > 0 ? history.flat() : gameState.players;
    const headers = [
      "Player", "Total Score", "Max Possible", "Date", 
      ...Array.from({ length: 10 }, (_, i) => `Frame ${i + 1} Score`),
      ...Array.from({ length: 10 }, (_, i) => `Frame ${i + 1} Rolls`)
    ].join(",");
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers + "\n"
      + data.map(g => {
          const frameScores = g.frames.map(f => f.cumulativeScore ?? "").join(",");
          const frameRolls = g.frames.map((f, i) => `"${formatFrameRolls(f, i).join(" ")}"`).join(",");
          return `${g.name},${g.totalScore},${g.maxPossibleScore},${new Date().toLocaleDateString()},${frameScores},${frameRolls}`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wicked_pins_scores_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAvailablePins = () => {
    if (isGameOver || !gameStarted || activePlayer.isGameOver) return [];
    
    const currentFrame = activePlayer.frames[gameState.currentFrameIndex];
    if (!currentFrame) return [];
    const frameRolls = currentFrame.rolls;

    if (gameState.currentFrameIndex < 9) {
      if (frameRolls.length === 0) return Array.from({ length: 11 }, (_, i) => i);
      const remaining = 10 - (frameRolls[0] || 0);
      return Array.from({ length: remaining + 1 }, (_, i) => i);
    } else {
      // 10th frame
      if (frameRolls.length === 0) return Array.from({ length: 11 }, (_, i) => i);
      if (frameRolls.length === 1) {
        if (frameRolls[0] === 10) return Array.from({ length: 11 }, (_, i) => i);
        const remaining = 10 - (frameRolls[0] || 0);
        return Array.from({ length: remaining + 1 }, (_, i) => i);
      }
      if (frameRolls.length === 2) {
        if (frameRolls[1] === 10 || (frameRolls[0] + frameRolls[1] === 10)) return Array.from({ length: 11 }, (_, i) => i);
        const remaining = 10 - (frameRolls[1] || 0);
        return Array.from({ length: remaining + 1 }, (_, i) => i);
      }
    }
    return [];
  };

  const availablePins = getAvailablePins();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-full max-w-lg aspect-square mb-8"
            >
              <img 
                src="https://i.ibb.co/qYxz9Kd4/Jean-E1smallb.png"
                alt="Alamo Jean-E"
                className="w-full h-full object-contain relative z-10 rounded-[3rem] shadow-[0_0_50px_rgba(168,85,247,0.3)]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/bowling/800/800";
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter neon-text">WICKED PINS</h1>
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Pro Bowling Tracker</p>
              
              <button 
                onClick={() => setShowSplash(false)}
                className="px-12 py-4 bg-purple-500 rounded-2xl font-black text-black hover:bg-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 mx-auto mt-8 group"
              >
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                START MATCH
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-2xl neon-border">
                  <Trophy className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter neon-text text-purple-400">WICKED PINS</h1>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Pro Bowling Tracker presented by Alamo Jean-E</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleReset}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                  title="Reset Game"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button 
                  onClick={exportScores}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                  title="Export CSV"
                >
                  <Download className="w-5 h-5" />
                </button>
                {isGameOver && (
                  <button 
                    onClick={saveToHistory}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-all"
                  >
                    <History className="w-4 h-4" />
                    <span>Save & New Game</span>
                  </button>
                )}
              </div>
            </header>

            {/* Setup Phase */}
            {!gameStarted && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Game Setup</h2>
                  <p className="text-zinc-500 text-sm">Add up to 6 bowlers to start the match</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameState.players.map((player, idx) => (
                    <div key={player.id} className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700 flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                        {idx + 1}
                      </div>
                      <input 
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(idx, e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-white font-bold flex-1"
                        placeholder="Player Name"
                      />
                      {gameState.players.length > 1 && (
                        <button 
                          onClick={() => removePlayer(idx)}
                          className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {gameState.players.length < 6 && (
                    <button 
                      onClick={addPlayer}
                      className="p-4 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 transition-all"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="font-bold">Add Bowler</span>
                    </button>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setGameStarted(true)}
                    className="px-12 py-4 bg-purple-500 rounded-2xl font-black text-black hover:bg-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    START MATCH
                  </button>
                </div>
              </motion.div>
            )}

            {/* Main Game Phase */}
            {gameStarted && (
              <main className="space-y-8">
                {/* Active Player Card & Max Score */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <motion.div 
                    layout
                    className="p-4 md:p-6 bg-zinc-900/50 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-purple-500 relative overflow-hidden group"
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 bg-purple-500 text-black text-[8px] font-black rounded uppercase">Active</span>
                          <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest border border-purple-500/30 px-1.5 py-0.5 rounded">F{gameState.currentFrameIndex + 1}</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter neon-text truncate">
                          {activePlayer.name}
                        </h2>
                      </div>
                      <div className="mt-2">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Score</span>
                        <div className="text-3xl md:text-5xl font-black text-white neon-text leading-none">
                          {activePlayer.totalScore}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    layout
                    className="p-4 md:p-6 bg-zinc-900/50 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-green-500/30 relative overflow-hidden flex flex-col justify-center items-center text-center"
                    animate={{ borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(34, 197, 94, 0.3)'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest">Max Possible</span>
                    <div className="text-3xl md:text-5xl font-black text-green-400 neon-text">
                      {activePlayer.maxPossibleScore}
                    </div>
                    <p className="text-[8px] text-zinc-500 mt-1 font-mono uppercase hidden sm:block">Assuming strikes for all remaining rolls</p>
                  </motion.div>
                </div>

                {/* Active Player Scoreboard */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max">
              {activePlayer.frames.map((frame, idx) => (
                <div 
                  key={idx}
                  className={`w-20 md:w-24 flex flex-col rounded-xl overflow-hidden border transition-all ${
                    gameState.currentFrameIndex === idx
                      ? 'border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/50' 
                      : 'border-zinc-800 bg-zinc-900/30'
                  }`}
                >
                  <div className="bg-zinc-800/50 py-1 text-[10px] font-mono text-center text-zinc-500 uppercase">
                    Frame {idx + 1}
                  </div>
                  <div className="flex flex-1 border-b border-zinc-800/50 h-10">
                    {frame.rolls.map((roll, rIdx) => (
                      <div key={rIdx} className="flex-1 flex items-center justify-center border-r last:border-r-0 border-zinc-800/50 font-bold text-sm">
                        {roll === 10 ? 'X' : roll === null ? '' : (rIdx === 1 && (frame.rolls[0] || 0) + roll === 10) ? '/' : roll}
                      </div>
                    ))}
                    {idx === 9 && frame.rolls.length < 3 && Array.from({ length: 3 - frame.rolls.length }).map((_, i) => (
                      <div key={i} className="flex-1 border-r last:border-r-0 border-zinc-800/50" />
                    ))}
                    {idx < 9 && frame.rolls.length < 2 && Array.from({ length: 2 - frame.rolls.length }).map((_, i) => (
                      <div key={i} className="flex-1 border-r last:border-r-0 border-zinc-800/50" />
                    ))}
                  </div>
                  <div className="h-12 flex items-center justify-center text-xl font-black text-white">
                    {frame.cumulativeScore ?? ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Numpad */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Enter Pins</h3>
                <button 
                  onClick={handleUndo}
                  disabled={activePlayer.rolls.length === 0}
                  className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-white transition-colors disabled:opacity-30"
                >
                  <Undo2 className="w-3 h-3" />
                  UNDO
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    disabled={!availablePins.includes(num) || isGameOver}
                    onClick={() => handleRoll(num)}
                    className={`
                      h-16 rounded-2xl font-black text-2xl transition-all
                      ${availablePins.includes(num) 
                        ? 'bg-zinc-800 hover:bg-purple-500 hover:text-black hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]' 
                        : 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    {num === 10 ? 'X' : num}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const newPlayers = [...gameState.players];
                    newPlayers[gameState.activePlayerIndex] = createNewPlayer(activePlayer.name);
                    setGameState(prev => ({ ...prev, players: newPlayers }));
                  }}
                  className="h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-6">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Leaderboard</h3>
              <div className="space-y-3">
                {gameState.players.map((player, idx) => (
                  <div 
                    key={player.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      gameState.activePlayerIndex === idx 
                        ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                        : 'bg-zinc-900/30 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        gameState.activePlayerIndex === idx ? 'bg-purple-500 text-black' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-white">{player.name}</div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                          {player.isGameOver ? 'Finished' : `Frame ${Math.min(10, Math.floor(player.rolls.length / 2) + 1)}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-black ${gameState.activePlayerIndex === idx ? 'text-purple-400 neon-text' : 'text-zinc-400'}`}>
                        {player.totalScore}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-600">MAX: {player.maxPossibleScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-zinc-900 rounded-[3rem] border-2 border-purple-500 p-8 md:p-12 text-center space-y-8 shadow-[0_0_50px_rgba(168,85,247,0.3)]"
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-white tracking-tighter">MATCH COMPLETE!</h2>
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Final Standings</p>
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {[...gameState.players].sort((a, b) => b.totalScore - a.totalScore).map((p, i) => (
                  <div key={p.id} className="p-4 bg-zinc-800/50 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-zinc-600">#{i + 1}</span>
                        <span className="font-bold text-white text-lg">{p.name}</span>
                      </div>
                      <span className="text-3xl font-black text-purple-400 neon-text">{p.totalScore}</span>
                    </div>
                    
                    <div className="grid grid-cols-10 gap-1">
                      {p.frames.map((f, fIdx) => {
                        const rolls = formatFrameRolls(f, fIdx);
                        return (
                          <div key={fIdx} className="flex flex-col items-center gap-1">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase">F{fIdx + 1}</span>
                            <div className="w-full bg-zinc-900/50 rounded flex flex-col items-center justify-center border border-zinc-700/30 overflow-hidden">
                              <div className="w-full h-5 flex items-center justify-center text-[9px] font-mono text-zinc-400 border-b border-zinc-800">
                                {rolls.join(' ')}
                              </div>
                              <div className="w-full h-6 flex items-center justify-center text-[10px] font-bold text-purple-400">
                                {f.cumulativeScore ?? '-'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={handleReset}
                  className="px-6 py-4 bg-zinc-800 rounded-2xl font-bold text-white hover:bg-zinc-700 transition-colors"
                >
                  New Match
                </button>
                <button 
                  onClick={saveToHistory}
                  className="px-6 py-4 bg-purple-500 rounded-2xl font-bold text-black hover:bg-purple-400 transition-colors"
                >
                  Save Results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Match Results Saved!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )}
  </AnimatePresence>
</div>
);
}
