'use client'
import { useState, useContext, useRef, useEffect } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import { Player, Match, Calendar } from "@/helpers/types";
import Game from "@/components/Game";
import OtherGames from "@/components/OtherGames";
import { setResult } from "@/helpers/actions";
import "./styles.css";

interface Props {
    oPlayers: Player[];
    oCurrentPlayer: Player;
}

function getSeasonCalendar(players: Player[]) {
    const playersId: number[] = players.map(player => player.id);
    let teamA: number[] =  [...playersId].splice(0, 5);
    let teamB: number[] =  [...playersId].splice(5, 5);
    let calendar = [];
    
    for (let i = 0; i < players.length - 1; i++) {
        let round: Match[] = []
        for (let j = 0; j < teamA.length; j++) {
            round.push([Number(teamA[j]), Number(teamB[j])]);
        }
        calendar.push(round);
        teamA.splice(1, 0, teamB[0]);
        teamB.push(teamA[teamA.length - 1]);
        teamA.splice(5, 1);
        teamB.shift();
    }
    return calendar;
} 

function findRank(currentPlayer: Player, players: Player[]): number {
    const bestFiltered = players.filter(player => (Number(currentPlayer.win) < Number(player.win)));
    const equalFiltered = players.filter(player => (Number(currentPlayer.win) === Number(player.win)));
    const betterPoints = equalFiltered.filter(player => (Number(currentPlayer.points) < Number(player.points)));
    const rank = bestFiltered.length + betterPoints.length + 1;
    return rank;
}

function getContender(match: Match, players: Player[], mainPlayer: number): Player {
    const opponentId = match.find(id => (id !== Number(mainPlayer)));
    const opponentPlayer = players.find((player: Player) => (Number(player.id) === opponentId));
    return opponentPlayer !== undefined ? opponentPlayer : players[0];
}

function getPlayerStat(player: Player) {
    return ((player.accuracy * 3) + (player.speed * 2) + (player.strenght * 2) + player.endurance) / 8;
}

const setOtherGamesComponent = (otherMatches: Array<number[]>, players: Player[]) => {
    const matchPlayers = otherMatches.map((match) => ([
        players.find((player: Player) => Number(player.id) === match[0]),
        players.find((player: Player) => Number(player.id) === match[1])
    ]));  
    return matchPlayers.map((match) => ({
        player1: {...match[0], rank: findRank(match[0]!, players)},
        player2: {...match[1], rank: findRank(match[1]!, players)},
        chances: Math.round((getPlayerStat(match[0]) / getPlayerStat(match[1])) * 100) / 100
    }));
}

export default function MatchClient({oPlayers, oCurrentPlayer}: Props) {

    const currentPlayer = {...oCurrentPlayer};
    const players = oPlayers;
    const [posterUpdate, setPosterUpdate] = useState(false);
    const [playNext, setPlayNext] = useState(false);
    const posterReverse = (tog: boolean) => {
        setPosterUpdate(tog);
        setPlayNext(false);
    };

    const newPlayers = useRef<Player[]>([]);
    const [calendar, setCalendar] = useState<Calendar>(getSeasonCalendar(players));
    const setPlayersCopy = useContext(PlayersContext).setAllPlayers;
    
    const updatePlayer: (arg:Player) => void = (player: Player) => {
        newPlayers.current = [...newPlayers.current, player];
        setPosterUpdate(false);
        if (newPlayers.current.length === players.length) {
            let newNewPLayers: Player[] = [];
            players.forEach(plr => {
                newNewPLayers.push({...newPlayers.current.find(nplr => nplr.id === plr.id)});
            });
            setPlayersCopy(newNewPLayers);
            newPlayers.current = [];
            setPlayNext(true);
        }
    };

    let currentMatch: Match = [];
    let otherMatches: Match[] = [];
    calendar[currentPlayer.game].forEach((match) => {
        if (match.indexOf(Number(currentPlayer.id)) > -1) {
            currentMatch = match;
        } else {
            otherMatches.push(match);
        }
    });
    
    const contender = getContender(currentMatch, players, currentPlayer.id);
    const currentRank = findRank(currentPlayer, players);
    const contenderRank = findRank(contender, players);
    
    const currentStats = getPlayerStat(currentPlayer);
    const contenderStats = getPlayerStat(contender);

    const chances = Math.round((currentStats / contenderStats) * 100) / 100;

    const player = {
        ...currentPlayer,
        rank: currentRank,
        isOpponent: false
    }
    const opponent = {
        ...contender,
        rank: contenderRank,
        isOpponent: true
    }

    const otherGames = setOtherGamesComponent(otherMatches, players);

    return(
        <>
            <div className="match-page">
                <Game 
                    player={player} 
                    opponent={opponent} 
                    chances={chances} 
                    updatePlayer={updatePlayer}
                    posterReverse={posterReverse}
                    playNext={playNext}
                >
                </Game>
                <div className="tab-games">
                    <>
                    {
                        otherGames.map((game, idx) => (
                            <OtherGames 
                                key={`match-${idx + 1}`}
                                player={game.player1}
                                opponent={game.player2}
                                chances={game.chances}
                                updatePlayer={updatePlayer}
                                posterUpdate={posterUpdate}
                            ></OtherGames>
                        ))
                    }
                    </>
                </div>
            </div>
        </>
    )
}