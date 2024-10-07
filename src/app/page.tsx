'use client'
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import { Player } from "@/helpers/types";
import { getRankSuffix, getMedal } from "@/utils/LeagueOverElems";
import playerImgPath from "@/utils/GetImgPlayer";
import React from "react";
import home from "./styles.module.css";


function showPlayer(players: Player[], mainPlayer: Player) {
  return players.map(plr => {
    const getLastScores = displayLastScores(plr.series);
    return(
      <div className={`${home["player-line"]} ${mainPlayer.id === plr.id ? home.current : ""}`} key={plr.id}>
        <div className={home.rank}>{plr.rank}</div>
        <div className={home.name}>{plr.fullname}</div>
        <div className={home.match}>{plr.game}</div>
        <div className={home.win}>{plr.win}</div>
        <div className={home.loss}>{plr.loss}</div>
        <div className={home.points}>{plr.points}</div>
        <div className={home["last-match"]}>
          {getLastScores}
        </div>
      </div>
    )
  });
}

function displayLastScores(series: string) {
  const newSerie = series.split('');
  return newSerie.map((match, idx) => {
    if (match === '-') return <span className={home.tobeplayed} key={idx}></span>
    if (match === 'W') return <span className={home.won} key={idx}></span>
    if (match === 'L') return <span className={home.lost} key={idx}></span>
  });
}

export function addRank(players: Player[]): Player[] {
  let rank = 1;
  let newPlayers = [...players];
  newPlayers[0].rank = 1;
  newPlayers.forEach((plr, idx) => {
    if (idx < 1) return;
    if (plr.win < newPlayers[idx - 1].win || plr.points < newPlayers[idx - 1].points) rank = idx + 1;
    plr.rank = rank; 
  });
  return newPlayers;
}

export default function Home() {
  const players: Player[] = useContext(PlayersContext).playersArray;
  const mainPlayer: Player =  players.find(plr => plr.id === useContext(PlayersContext).mainPlayer.id) || useContext(PlayersContext).mainPlayer;
  const currentGame = mainPlayer.game;
  players.sort((a, b) => b.win !== a.win ? b.win - a.win : b.points - a.points);
  const sortedPlayers: Player[] = addRank(players);
  const showPlayers = showPlayer(sortedPlayers, mainPlayer);
  
  return (
    <div className={home.home}>
      {currentGame === 9 && <div className={home["league-over"]}>
        <div className={home.photo}>
          <img src={`/img/${playerImgPath(mainPlayer.fullname)}.png`}/>
        </div>
        <div className={home["final-board"]}>
          <div className={home["final-rank"]}>
            {mainPlayer.rank}<sup className="suffix">{getRankSuffix(mainPlayer.rank)}</sup>
          </div> 
          {getMedal(mainPlayer.rank)}
        </div>
      </div>}
      <div className={home["league-tab"]}>
        <div className={`${home["player-line"]} ${home.top}`}>
          <div className={home.rank}></div>
          <div className={home.name}>Joueur</div>
          <div className={home.match}>M</div>
          <div className={home.win}>V</div>
          <div className={home.loss}>D</div>
          <div className={home.points}>P</div>
          <div className={home["last-match"]}>
            Série
          </div>
        </div>
        {showPlayers}
      </div>
    </div>
  );
}
