'use client'
import { useState, useContext, useEffect } from "react";
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

function displayOtherGames(otherMatches: Array<number[]>, players: Player[], updatePlayer:(arg:Player) => void, posterUpdate: boolean) {
    const matchPlayers = otherMatches.map((match) => ([
        players.find((player: Player) => Number(player.id) === match[0]),
        players.find((player: Player) => Number(player.id) === match[1])
    ]));  
    const matchPlayersWithRank =  matchPlayers.map((match) => ([
        {...match[0], rank: findRank(match[0]!, players)},
        {...match[1], rank: findRank(match[1]!, players)}
    ]));
    
    return matchPlayersWithRank.map((match) => {
        const chances = Math.round((getPlayerStat(match[0]) / getPlayerStat(match[1])) * 100) / 100;
        return (<OtherGames 
            key={`${match[0].game}-${match[0].id}`}
            player={match[0]}
            opponent={match[1]}
            chances={chances}
            updatePlayer={updatePlayer}
            posterUpdate={posterUpdate}
        ></OtherGames>);
    });
}

export default function MatchClient({oPlayers, oCurrentPlayer}: Props) {


    const currentPlayer = {...oCurrentPlayer};
    const players = oPlayers;
    const [posterUpdate, setPosterUpdate] = useState(false);
    const posterReverse = () => {setPosterUpdate(!posterUpdate)};

    const [newPlayers, setNewPlayers] = useState<Player[]>([]);
    const [calendar, setClendar] = useState<Calendar>(getSeasonCalendar(players));
    const setPlayersCopy = useContext(PlayersContext).setAllPlayers;

    const updatePlayer: (arg:Player) => void = (player: Player) => {
        console.log('PLAYER', player);
        console.log('AAAAAAAA',newPlayers);
        setNewPlayers([player]);
        console.log('BBBBBBBB',newPlayers);
        if (newPlayers.length === players.length) {
            console.log('NEW PLAYERS', newPlayers)
            let newNewPLayers: Player[] = [];
            players.forEach(plr => {
                newNewPLayers.push({...newPlayers.find(nplr => nplr.id === plr.id)});
            });
            setPlayersCopy(newNewPLayers);
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

    const [otherGames, setOtherGames] = useState(displayOtherGames(otherMatches, players, updatePlayer, posterUpdate));
    
    return(
        <>
            <div className="match-page">
                <Game 
                    player={player} 
                    opponent={opponent} 
                    chances={chances} 
                    updatePlayer={updatePlayer} 
                    posterUpdate={posterUpdate}
                    posterReverse={posterReverse}
                >
                </Game>
                <div className="tab-games">
                    {otherGames}
                </div>
            </div>
        </>
    )
}