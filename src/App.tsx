import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { AuctionScreen } from './screens/AuctionScreen';
import { RefereeingScreen } from './screens/RefereeingScreen';
import { AuctionGame, AuctionState } from './game/engine';
import { GameSettings } from './types/models';

type Screen = 'home' | 'setup' | 'auction' | 'refereeing';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [game, setGame] = useState<AuctionGame | null>(null);
  const [gameState, setGameState] = useState<AuctionState | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);

  useEffect(() => {
    // Check if save exists in localStorage
    const saved = localStorage.getItem('kora_save_v1');
    setHasSavedGame(!!saved);
  }, [currentScreen]);

  const handleStartNew = () => {
    setCurrentScreen('setup');
  };

  const handleResume = () => {
    const loadedGame = AuctionGame.loadSavedGame(newState => {
      setGameState(newState);
    });
    if (loadedGame) {
      setGame(loadedGame);
      setGameState(loadedGame.state);
      if (loadedGame.state.phase === 'finished') {
        setCurrentScreen('refereeing');
      } else {
        setCurrentScreen('auction');
      }
    }
  };

  const handleConfirmSettings = (settings: GameSettings) => {
    const newGame = new AuctionGame(settings, newState => {
      setGameState(newState);
    });
    setGame(newGame);
    setGameState(newGame.state);
    setCurrentScreen('auction');
  };

  const handleFinishAuction = () => {
    setCurrentScreen('refereeing');
  };

  const handleExitToHome = () => {
    if (game) {
      game.dispose();
    }
    setCurrentScreen('home');
  };

  const handleResetAll = () => {
    AuctionGame.clearSavedGame();
    if (game) {
      game.dispose();
    }
    setGame(null);
    setGameState(null);
    setHasSavedGame(false);
    setCurrentScreen('home');
  };

  return (
    <div className="w-full min-h-screen bg-[#050B12] text-[#F3F6FB]">
      {currentScreen === 'home' && (
        <HomeScreen
          onStartNew={handleStartNew}
          onResume={handleResume}
          hasSavedGame={hasSavedGame}
        />
      )}

      {currentScreen === 'setup' && (
        <SetupScreen
          onConfirmSettings={handleConfirmSettings}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'auction' && game && gameState && (
        <AuctionScreen
          game={game}
          state={gameState}
          onFinishAuction={handleFinishAuction}
          onExit={handleExitToHome}
        />
      )}

      {currentScreen === 'refereeing' && gameState && (
        <RefereeingScreen
          teams={gameState.teams}
          onExit={handleExitToHome}
          onNewGame={handleResetAll}
        />
      )}
    </div>
  );
};

export default App;
