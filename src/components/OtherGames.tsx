'use client'
import { useState, useEffect } from "react";
import { Player } from "@/helpers/types";
import playerImgPath from "@/utils/GetImgPlayer";
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
    posterUpdate: boolean;
}

export default function OtherGames({player, opponent, chances, updatePlayer, posterUpdate}: Props) {
    const chanceRate = chances;
    let newPlayer1 = {...player};
    let newPlayer2 = {...opponent};

    const [player1, setPlayer1] = useState({...player});
    const [player2, setPlayer2] = useState({...opponent});
    const [score, setScore] = useState([0, 0]);
    const [displayResult, setDisplayResult] = useState(false);
    const [win, setWin] = useState(false);
    if (posterUpdate) {
        // setScore([0, 0]);
        // setPlayer1({...player});
        // setPlayer2({...opponent});
        // setDisplayResult(false);
        // setWin(false);
    };

    useEffect(() => {
        let handleTimeout;
        if ((score[0] < 5 && score[1] < 5) || (Math.abs(score[0] - score[1]) < 2)) {
            handleTimeout = setTimeout(() => {
                setScore(playPoint(chanceRate) ? [score[0] + 1, score[1]] : [score[0], score[1] + 1]);
            }, 800);
        }
        else {
            const diff = score[0] - score[1];
            newPlayer1 = {
                ...player,
                points: Number(player.points) + diff,
                game: Number(player.game) + 1,
                series: `${diff > 0 ? 'W' : 'L'}${player.series.substring(0, 4)}`,
                win: score[0] > score[1] ? Number(player.win) + 1 : player.win,
                loss: score[0] > score[1] ? player.loss : Number(player.loss) + 1
            };
            newPlayer2 = {
                ...opponent,
                points: Number(opponent.points) + diff,
                game: Number(opponent.game) + 1,
                series: `${diff > 0 ? 'L' : 'W'}${opponent.series.substring(0, 4)}`,
                win: score[0] > score[1] ? opponent.win : Number(opponent.win) + 1,
                loss: score[0] > score[1] ? Number(opponent.loss) + 1 : opponent.loss
            };
            if (score[0] > score[1]) setWin(true);
            // console.log('PLAYER', newPlayer1);
            // console.log('OPPONENT', newPlayer2);
            updatePlayer(newPlayer1);
            updatePlayer(newPlayer2);
            setDisplayResult(true);
        }
        return () => clearTimeout(handleTimeout);
    }, [score]);

    
    return(
        <>
            <div className={`line-game ${displayResult && (win ? "game-win" : "game-loss")}`}>
                <div className="player">
                    <div className="info">
                        <div className="photo">
                            <img src={`/img/${playerImgPath(player1.fullname)}.png`}/>
                        </div>
                        <div className="rank">{player1.rank}</div>
                        <div className="name">{player1.fullname}</div>
                    </div>
                    <div className="score">
                        {score[0]}
                    </div>
                </div>
                <div className="sep">-</div>
                <div className="player opponent">
                    <div className="info">
                        <div className="photo">
                            <img src={`/img/${playerImgPath(player2.fullname)}.png`}/>
                        </div>
                        <div className="rank">{player2.rank}</div>
                        <div className="name">{player2.fullname}</div>
                    </div>
                    <div className="score">
                        {score[1]}
                    </div>
                </div>
            </div>
        </>
    )
}