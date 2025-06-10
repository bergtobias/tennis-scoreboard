import Scoreboard, { GameState } from "@/components/Scoreboard";

export default function Home() {
  const data = {
    hometeam: {
      name: "Home",
      color: "#FF0000",
      score: 0,
      games: 0,
      sets: 0,
    },
    awayteam: {
      name: "Away",
      color: "#0000FF",
      score: 0,
      games: 0,
      sets: 0,
    },
    bestOfSets: 5,
    gameWinner: null as string | null,
    setWinner: null as string | null,
    history: [],
  } satisfies GameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <Scoreboard data={data} />
    </div>
  );
}
