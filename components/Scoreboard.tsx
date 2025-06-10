"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Trophy, RotateCcw, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

type GameHistory = Array<
  Omit<GameState, "history"> & { action: string; timestamp: Date }
>;

export type GameState = {
  hometeam: {
    name: string;
    color: string;
    score: number;
    games: number;
    sets: number;
  };
  awayteam: {
    name: string;
    color: string;
    score: number;
    games: number;
    sets: number;
  };
  bestOfSets: number;
  gameWinner: string | null;
  setWinner: string | null;
  history: GameHistory;
};

const tennisPoints = ["0", "15", "30", "40"] as const;

type ScoreboardDisplayProps = {
  gameState: GameState;
};

const ScoreboardDisplay = ({ gameState }: ScoreboardDisplayProps) => {
  const isMatchComplete = gameState.setWinner !== null;

  return (
    <Card className="shadow-2xl border-0 overflow-hidden py-0 gap-0">
      <CardHeader className="text-center pb-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="w-10 h-10 text-yellow-300" />
          <h1 className="text-4xl font-bold tracking-tight">
            Tennis Scoreboard
          </h1>
          <Trophy className="w-10 h-10 text-yellow-300" />
        </div>
        <CardDescription className="text-emerald-100 text-lg font-medium">
          Professional tennis scoring system
        </CardDescription>
        {isMatchComplete && (
          <div className="mt-4 p-3 bg-yellow-400 text-yellow-900 rounded-lg font-bold text-xl">
            🏆 Match Winner: {gameState.setWinner}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="space-y-6">
          {[
            { team: gameState.hometeam, key: "hometeam" },
            { team: gameState.awayteam, key: "awayteam" },
          ].map(({ team, key }) => {
            const opponent =
              key === "hometeam" ? gameState.awayteam : gameState.hometeam;
            const isWinning =
              team.sets > opponent.sets ||
              (team.sets === opponent.sets && team.games > opponent.games);

            return (
              <div
                key={team.name}
                className={`flex items-center justify-between p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  isWinning
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-300 border-l-4 border-l-emerald-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div
                    className="w-8 h-8 rounded-full border-3 border-white shadow-lg"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-3xl font-bold text-gray-800 tracking-wide">
                    {team.name}
                  </span>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Sets
                    </div>
                    <div className="text-4xl font-bold text-purple-600 bg-purple-50 rounded-lg px-3 py-2">
                      {team.sets}
                    </div>
                  </div>

                  <div className="text-center min-w-[80px]">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Games
                    </div>
                    <div className="text-4xl font-bold text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                      {team.games}
                    </div>
                  </div>

                  <div className="text-center min-w-[120px]">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Points
                    </div>
                    <div className="text-4xl font-bold text-red-600 bg-red-50 rounded-lg px-4 py-2 min-h-[80px] flex items-center justify-center">
                      {getDisplayScore(team.score, opponent.score)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

type ScoreboardActionsProps = {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
};

const ScoreboardActions = ({
  gameState,
  setGameState,
}: ScoreboardActionsProps) => {
  const isMatchComplete = gameState.setWinner !== null;

  return (
    <Card className="shadow-xl border-0 h-full py-0 gap-0 bg-gradient-to-br from-gray-50 to-slate-100">
      <CardHeader className="text-center pb-4 bg-gradient-to-r from-slate-700 to-gray-700 text-white rounded-t-lg py-6">
        <h1 className="text-2xl font-bold text-white">Game Controls</h1>
      </CardHeader>
      <CardContent className="p-6 ">
        <div className="space-y-4">
          <Button
            onClick={() => addPoint("hometeam", setGameState)}
            disabled={isMatchComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Point to {gameState.hometeam.name}
          </Button>

          <Button
            onClick={() => addPoint("awayteam", setGameState)}
            disabled={isMatchComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Point to {gameState.awayteam.name}
          </Button>

          <div className="pt-4 border-t border-gray-200 space-y-3">
            <Button
              onClick={() => undoAction(setGameState)}
              variant="outline"
              size="lg"
              className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold"
              disabled={gameState.history.length === 0}
            >
              <Minus className="w-4 h-4 mr-2" />
              Undo Last Action
            </Button>

            <Button
              onClick={() => resetGame(setGameState)}
              size="lg"
              variant="destructive"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-4 text-lg font-bold shadow-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Match
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type ScoreboardHistoryProps = {
  gameHistory: GameHistory;
};

const ScoreboardHistory = ({ gameHistory }: ScoreboardHistoryProps) => {
  const reversedHistory = [...gameHistory].reverse();

  return (
    <Card className="shadow-xl border-0 h-full py-0 gap-0 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="text-center pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg py-6 ">
        <h2 className="text-2xl font-bold">Match History</h2>
        <CardDescription className="text-gray-200 text-sm">
          {gameHistory.length} actions recorded
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 ">
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {reversedHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg">No actions yet</p>
                <p className="text-sm">Start playing to see history</p>
              </div>
            ) : (
              reversedHistory.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                      {entry.action}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-700">
                        {entry.hometeam.name}
                      </div>
                      <div className="text-red-600">
                        {entry.hometeam.sets}-{entry.hometeam.games}-
                        {getDisplayScore(
                          entry.hometeam.score,
                          entry.awayteam.score
                        )}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-700">
                        {entry.awayteam.name}
                      </div>
                      <div className="text-blue-600">
                        {entry.awayteam.sets}-{entry.awayteam.games}-
                        {getDisplayScore(
                          entry.awayteam.score,
                          entry.hometeam.score
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

function getDisplayScore(score: number, opponentScore: number): string {
  if (score >= 3 && opponentScore >= 3) {
    if (score === opponentScore) return "Deuce";
    if (score > opponentScore) return "Ad";
    return "40";
  }

  return tennisPoints[Math.min(score, 3)] || "40";
}

function resetGame(setGameState: Dispatch<SetStateAction<GameState>>) {
  toast.success("Match has been reset!");
  setGameState((prev) => ({
    ...prev,
    hometeam: {
      ...prev.hometeam,
      score: 0,
      games: 0,
      sets: 0,
    },
    awayteam: {
      ...prev.awayteam,
      score: 0,
      games: 0,
      sets: 0,
    },
    gameWinner: null,
    setWinner: null,
    history: [],
  }));
}

function undoAction(setGameState: Dispatch<SetStateAction<GameState>>) {
  setGameState((prev) => {
    const history = prev.history;
    if (history.length === 0) {
      toast.error("No actions to undo!");
      return prev;
    }

    const lastState = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    return {
      ...lastState,
      history: newHistory,
    };
  });
  toast.success("Action undone!");
}

function addPoint(
  team: "hometeam" | "awayteam",
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  setGameState((prev) => {
    const currentScore = prev[team].score;
    const opponentTeam = team === "hometeam" ? "awayteam" : "hometeam";
    const opponentScore = prev[opponentTeam].score;

    const historyEntry = {
      ...prev,
      action: `Point to ${prev[team].name}`,
      timestamp: new Date(),
    };
    const newHistory = [...prev.history, historyEntry];

    const newState = { ...prev, history: newHistory };
    let gameWon = false;

    if (currentScore >= 3) {
      if (opponentScore >= 3) {
        if (currentScore >= opponentScore + 1) {
          gameWon = true;
        } else {
          newState[team] = {
            ...newState[team],
            score: currentScore + 1,
          };
        }
      } else {
        gameWon = true;
      }
    } else {
      newState[team] = {
        ...newState[team],
        score: currentScore + 1,
      };
    }

    if (gameWon) {
      newState[team] = {
        ...newState[team],
        score: 0,
        games: newState[team].games + 1,
      };
      newState[opponentTeam] = {
        ...newState[opponentTeam],
        score: 0,
      };
      newState.gameWinner = newState[team].name;

      const teamGames = newState[team].games;
      const opponentGames = newState[opponentTeam].games;

      if (teamGames >= 6 && teamGames - opponentGames >= 2) {
        newState[team] = {
          ...newState[team],
          sets: newState[team].sets + 1,
          games: 0,
        };
        newState[opponentTeam] = {
          ...newState[opponentTeam],
          games: 0,
        };

        if (newState[team].sets >= Math.ceil(newState.bestOfSets / 2)) {
          newState.setWinner = newState[team].name;
        } else {
        }
      }
    } else {
      newState.gameWinner = null;
    }

    return newState;
  });
}

type ScoreboardProps = {
  data: GameState;
};

const Scoreboard = ({ data }: ScoreboardProps) => {
  const [gameState, setGameState] = useState<GameState>(data);

  useEffect(() => {
    setGameState((prev) => ({ ...prev, history: [] }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-8">
        <ScoreboardDisplay gameState={gameState} />
        <ScoreboardActions gameState={gameState} setGameState={setGameState} />
        <ScoreboardHistory gameHistory={gameState.history} />
      </div>
    </div>
  );
};

export default Scoreboard;
