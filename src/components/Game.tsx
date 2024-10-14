'use client'
import { useState, useEffect } from "react";
import PlayerMatch from "@/components/PlayerMatch";
import { Player } from "@/helpers/types";
import { getRankSuffix, getMedal } from "@/utils/LeagueOverElems";

import match from "@/app/match/styles.module.css";

interface Props {
    player: Player;
    opponent: Player;
    chances: number;
    updatePlayer(player: Player): void;
    posterReverse(toggle:boolean): void;
    playNext: boolean;
}

/**
 * Randomly attibute point to one of the players applying a correction coefficient (chances) depending on players stats
 * @param chances 
 * @returns boolean - main player lost or win the point
 */
function playPoint(chances: number) {
    let randomChances = Math.floor((Math.random() * 100) + 1);
    return (randomChances * chances) > 50;
}

export default function Game({player, opponent, chances, updatePlayer, posterReverse, playNext}: Props) {
    const chanceRate = chances;
    let updatedPlayer = {...player};
    let updatedOpponent = {...opponent};

    const [profilePlayer, setProfilePlayer] = useState({...player});
    const [profileOpponent, setProfileOpponent] = useState({...opponent});
    const [score, setScore] = useState([0, 0]);
    const [displayResult, setDisplayResult] = useState(false);
    const [win, setWin] = useState(false);
    
    const updateMoiCa = () => {
        setScore([0, 0]);
        setProfilePlayer({...player});
        setProfileOpponent({...opponent});
        setDisplayResult(false);
        setWin(false); 
        posterReverse(true);
    }

    useEffect(() => {
        let handleTimeoutMain: ReturnType<typeof setTimeout>;
        if ((score[0] < 5 && score[1] < 5) || (Math.abs(score[0] - score[1]) < 2)) {
            handleTimeoutMain = setTimeout(() => {
                setScore(playPoint(chanceRate) ? [score[0] + 1, score[1]] : [score[0], score[1] + 1]);
            }, 800);
        }
        else {
            const diff = score[0] - score[1];
            updatedPlayer = {
                ...player,
                points: Number(player.points) + diff,
                game: Number(player.game) + 1,
                series: `${diff > 0 ? 'W' : 'L'}${player.series.substring(0, 4)}`,
                win: score[0] > score[1] ? Number(player.win) + 1 : player.win,
                loss: score[0] > score[1] ? player.loss : Number(player.loss) + 1
            };
            updatedOpponent = {
                ...opponent,
                points: Number(opponent.points) - diff,
                game: Number(opponent.game) + 1,
                series: `${diff > 0 ? 'L' : 'W'}${opponent.series.substring(0, 4)}`,
                win: score[0] > score[1] ? opponent.win : Number(opponent.win) + 1,
                loss: score[0] > score[1] ? Number(opponent.loss) + 1 : opponent.loss
            };
            if (score[0] > score[1]) setWin(true);
            updatePlayer(updatedPlayer);
            updatePlayer(updatedOpponent);
            setDisplayResult(true);
        }
        return () => clearTimeout(handleTimeoutMain);
    }, [score]);

    
    return(
        <>
            <div className={`${match.game} ${displayResult && (win ? match["game-win"] : match["game-loss"])}`}>
                <PlayerMatch name={profilePlayer.fullname} score={score[0]} rank={profilePlayer.rank} isOpponent={profilePlayer.isOpponent}></PlayerMatch>
                <div className={match.sep}>VS</div>
                <PlayerMatch name={profileOpponent.fullname} score={score[1]} rank={profileOpponent.rank} isOpponent={profileOpponent.isOpponent}></PlayerMatch>
                {displayResult && <div className={match.anim}>{win ? "WINNER" : "LOSER"}</div>}
                {playNext && (player.game === 9 ?
                        <div className={match["final-board"]}>
                            <div className={match["final-rank"]}>
                                {player.rank}<sup>{getRankSuffix(player.rank)}</sup>
                            </div> 
                            {getMedal(player.rank)}
                        </div> :
                        <button className={match["replay-btn"]} onClick={() => {updateMoiCa();}}>NEXT MATCH</button>
                    )
                }
            </div>
        </>
    )
}