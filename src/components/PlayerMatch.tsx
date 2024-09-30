
'use client'
import "@/app/match/styles.css";
import playerImgPath from "@/utils/GetImgPlayer";

interface Props {
    name: string;
    score: number;
    rank: number;
    isOpponent: boolean;
}


export default function PlayerMatch({name, score, rank, isOpponent}: Props) {
    return(
        <div className={`player ${isOpponent && "opponent"}`}>
            <div className="info">
                <div className="rank">{rank}</div>
                <div className="name">{name}</div>
            </div>
            <div className="main-info">
                <div className="photo">
                    <img src={`/img/${playerImgPath(name)}.png`}/>
                </div>
                <div className="score">
                    {score}
                </div>
            </div>
        </div>
    );
}