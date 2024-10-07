
'use client'
// import "@/app/match/styles.css";
import match from "@/app/match/styles.module.css";
import playerImgPath from "@/utils/GetImgPlayer";

interface Props {
    name: string;
    score: number;
    rank: number;
    isOpponent: boolean;
}


export default function PlayerMatch({name, score, rank, isOpponent}: Props) {
    return(
        <div className={`${match.player} ${isOpponent && match.opponent}`}>
            <div className={match.info}>
                <div className={match.rank}>{rank}</div>
                <div className={match.name}>{name}</div>
            </div>
            <div className={match["main-info"]}>
                <div className={match.photo}>
                    <img src={`/img/${playerImgPath(name)}.png`}/>
                </div>
                <div className={match.score}>
                    {score}
                </div>
            </div>
        </div>
    );
}