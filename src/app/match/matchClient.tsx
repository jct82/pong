'use client'
import { useState, useContext, useRef, useEffect } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import { Player, Match, Calendar } from "@/helpers/types";
import Game from "@/components/Game";
import OtherGames from "@/components/OtherGames";
import match from "./styles.module.css";

interface Props {
    oPlayers: Player[];
    oCurrentPlayer: Player;
}

interface MatchItf {
    player1: Player[];
    player2: Player[];
    chances: number;
}

/**
 * Set championship calendar
 * @param players - all players data object
 * @returns array - A championship days array of 2 numbers arrays[player1 id, player2 id] 
 */
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

/**
 * Set player rank
 * @param currentPlayer - selected player data object
 * @param players - all players data objects
 * @returns number - player's rank
 */
function findRank(currentPlayer: Player, players: Player[]): number {
    const bestFiltered = players.filter(player => (Number(currentPlayer.win) < Number(player.win)));
    const equalFiltered = players.filter(player => (Number(currentPlayer.win) === Number(player.win)));
    const betterPoints = equalFiltered.filter(player => (Number(currentPlayer.points) < Number(player.points)));
    const rank = bestFiltered.length + betterPoints.length + 1;
    return rank;
}

/**
 * Get opponent player in current match
 * @param match - array of match players id  
 * @param players - all players data objects
 * @param mainPlayer - selected player data object
 * @returns Player - selected player opponent data object
 */
function getContender(match: Match, players: Player[], mainPlayer: number): Player {
    const opponentId = match.find(id => (id !== Number(mainPlayer)));
    const opponentPlayer = players.find((player: Player) => (Number(player.id) === opponentId));
    return opponentPlayer !== undefined ? opponentPlayer : players[0];
}

/**
 * Calculate players stats
 * @param player 
 * @returns number corresponding to globals player's performance
 */
function getPlayerStat(player: Player) {
    return ((player.accuracy * 3) + (player.speed * 2) + (player.strenght * 2) + player.endurance) / 8;
}

/**
 * Turn match array of players id to array of players data object
 * @param otherMatches - array of day matches arrays [player1 id, player2 id]
 * @param players - all players data objects
 * @returns - array of two players data object set for otherMatch component 
 */
const setOtherGamesComponent = (otherMatches: Array<number[]>, players: Player[]) => {
    const matchPlayers = otherMatches.map((match) => ([
        players.find((player: Player) => Number(player.id) === match[0]),
        players.find((player: Player) => Number(player.id) === match[1])
    ]));  
    return matchPlayers.map((match) => ({
        player1: {...match[0], rank: findRank(match[0]!, players)},
        player2: {...match[1], rank: findRank(match[1]!, players)},
        chances: Math.round((getPlayerStat(match[0]!) / getPlayerStat(match[1]!)) * 100) / 100
    }));
}

export default function MatchClient({oPlayers, oCurrentPlayer}: Props) {

    const currentPlayer = {...oCurrentPlayer};
    const players = oPlayers;
    const [posterUpdate, setPosterUpdate] = useState(false);
    const [playNext, setPlayNext] = useState(false);
    const isLeagueOver = playNext && currentPlayer.game === 9 ? true : false;
    const posterReverse = (tog: boolean) => {
        setPosterUpdate(tog);
        setPlayNext(false);
    };

    const newPlayers = useRef<Player[]>([]);
    const [calendar, setCalendar] = useState<Calendar>(getSeasonCalendar(players));
    const setPlayersCopy = useContext(PlayersContext).setAllPlayers;
    
    /**
     * Update player's data record withdata of last updated player
     * If all players are updated (all match played), update players data in context provider
     * @param player 
     */
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
    const calendarDay = currentPlayer.game > calendar.length - 1 ? calendar.length - 1 : currentPlayer.game;

    calendar[calendarDay].forEach((match) => {
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
            <div className={`${match["match-page"]} ${isLeagueOver ? match["league-over"] : ""}`}>
                <Game
                    player={player} 
                    opponent={opponent} 
                    chances={chances} 
                    updatePlayer={updatePlayer}
                    posterReverse={posterReverse}
                    playNext={playNext}
                >
                </Game>
                <div className={match["tab-games"]}>
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