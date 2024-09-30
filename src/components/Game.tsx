'use client'
import { useState, useEffect } from "react";
import PlayerMatch from "@/components/PlayerMatch";
import { Player } from "@/helpers/types";
import { useRouter } from 'next/navigation'

import "@/app/match/styles.css";


function playPoint(chances: number) {
    let randomChances = Math.floor((Math.random() * 100) + 1);
    return (randomChances * chances) > 50;
}

interface Props {
    player: Player;
    opponent: Player;
    chances: number;
    updatePlayer(player: Player): void;
    posterUpdate: boolean,
    posterReverse(): void;
}


export default function Game({player, opponent, chances, updatePlayer, posterUpdate, posterReverse}: Props) {
    const chanceRate = chances;
    let updatedPlayer = {...player};
    let updatedOpponent = {...opponent};

    const [profilePlayer, setProfilePlayer] = useState({...player});
    const [profileOpponent, setProfileOpponent] = useState({...opponent});
    const [score, setScore] = useState([0, 0]);
    const [displayResult, setDisplayResult] = useState(false);
    const [win, setWin] = useState(false);

    if (posterUpdate) {
        // setScore([0, 0]);
        // setProfilePlayer({...player});
        // setProfileOpponent({...opponent});
        // setDisplayResult(false);
        // setWin(false);
        // posterReverse();
    }

    useEffect(() => {
        let handleTimeout;
        if ((score[0] < 5 && score[1] < 5) || (Math.abs(score[0] - score[1]) < 2)) {
            handleTimeout = setTimeout(() => {
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
                points: Number(opponent.points) + diff,
                game: Number(opponent.game) + 1,
                series: `${diff > 0 ? 'L' : 'W'}${opponent.series.substring(0, 4)}`,
                win: score[0] > score[1] ? opponent.win : Number(opponent.win) + 1,
                loss: score[0] > score[1] ? Number(opponent.loss) + 1 : opponent.loss
            };
            if (score[0] > score[1]) setWin(true);
            console.log('PLAYER', updatedPlayer);
            console.log('OPPONENT', updatedOpponent);
            updatePlayer(updatedPlayer);
            updatePlayer(updatedOpponent);
            setDisplayResult(true);
            console.log('PLAYER111', updatedPlayer);
            console.log('OPPONENT111', updatedOpponent);
        }
        return () => clearTimeout(handleTimeout);
    }, [score]);

    
    return(
        <>
            <div className={`game ${displayResult && (win ? "game-win" : "game-loss")}`}>
                <PlayerMatch name={profilePlayer.fullname} score={score[0]} rank={profilePlayer.rank} isOpponent={profilePlayer.isOpponent}></PlayerMatch>
                <div className="sep">VS</div>
                <PlayerMatch name={profileOpponent.fullname} score={score[1]} rank={profileOpponent.rank} isOpponent={profileOpponent.isOpponent}></PlayerMatch>
                {displayResult && <div className="anim">{win ? "WINNER" : "LOSER"}</div>}
                {displayResult && <button className="replay-btn" onClick={() => {posterReverse}}>NEXT MATCH</button>}
            </div>
        </>
    )
}