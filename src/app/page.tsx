'use client'
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import { Player } from "@/helpers/types";
import React from "react";
import "./page.css";


function showPlayer(players: Player[], mainPlayer: Player) {
  return players.map(plr => {
    const getLastScores = displayLastScores(plr.series);
    return(
      <div className={`player-line ${mainPlayer.id === plr.id && "current"}`} key={plr.id}>
        <div className="rank">{plr.rank}</div>
        <div className="name">{plr.fullname}</div>
        <div className="match">{plr.game}</div>
        <div className="win">{plr.win}</div>
        <div className="loss">{plr.loss}</div>
        <div className="points">{plr.points}</div>
        <div className="last-match">
          {getLastScores}
        </div>
      </div>
    )
  });
}

function displayLastScores(series: string) {
  const newSerie = series.split('');
  return newSerie.map(match => {
    if (match === '-') return <span className="tobeplayed"></span>
    if (match === 'W') return <span className="won"></span>
    if (match === 'L') return <span className="lost"></span>
  });
}

function addRank(players: Player[]): Player[] {
  let rank = 1;
  let newPlayers = [...players];
  newPlayers.forEach((plr, idx) => {
    idx > 0
    && (plr.win < newPlayers[idx - 1].win || plr.points < newPlayers[idx - 1].points)
    && rank++;
    plr.rank = rank; 
  });
  return newPlayers;
}

export default function Home() {
  const players: Player[] = useContext(PlayersContext).playersArray;
  const mainPlayer: Player =  useContext(PlayersContext).mainPlayer;
  players.sort((a, b) => b.win !== a.win ? b.win - a.win : b.points - a.points);
  const sortedPlayers: Player[] = addRank(players);
  const showPlayers = showPlayer(sortedPlayers, mainPlayer);
  
  return (
    <main className="main">
      <div className="league-tab">
        <div className="player-line top">
          <div className="rank"></div>
          <div className="name">Joueur</div>
          <div className="match">M</div>
          <div className="win">V</div>
          <div className="loss">D</div>
          <div className="points">P</div>
          <div className="last-match">
            Série
          </div>
        </div>
        {showPlayers}
      </div>
    </main>
  );
}
