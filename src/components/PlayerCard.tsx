
'use client'
import { Player } from "@/helpers/types";
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import playerImgPath from "@/utils/GetImgPlayer";
import pongist from "@/app/pongists/styles.module.css";

interface Props {
    player: Player;
};

export default function PlayerCard({player}: Props) {
    const {id, fullname, age, accuracy, speed, strenght, endurance, game, win, loss} = player;
    const currentPlayer: number = useContext(PlayersContext).mainPlayer.id;
    const setPlayerCopy = useContext(PlayersContext).setMainPlayer;
    return(
        <div className={`${pongist.player} ${currentPlayer === id ? pongist.current : ""}`}>
            <div className={pongist.info}>
                <div className={pongist.name}>{fullname}</div>
                <div className={pongist.age}>{age}<span>yr</span></div>
                {
                    currentPlayer !== id && 
                    <button 
                        className={pongist["select-player"]} 
                        onClick={() => {setPlayerCopy(Number(id))}}>
                        SELECT
                    </button>
                }
            </div>
            <div className={pongist["main-info"]}>
                <div className={pongist.photo}>
                    <img src={`/img/${playerImgPath(fullname)}.png`}/>
                </div>
                <div className={pongist.stat}>
                    <div className={pongist["stat-bloc"]}>
                        <div className={pongist["stat-name"]}>ACCURACY :</div>
                        <div className={pongist["stat-gauge"]}>
                            <div className={pongist.gauge}>
                                <div style={{width: `${accuracy}%`}}></div>
                            </div>
                            <div className={pongist.score}>{accuracy}</div>
                        </div>
                    </div>
                    <div className={pongist["stat-bloc"]}>
                        <div className={pongist["stat-name"]}>SPEED :</div>
                        <div className={pongist["stat-gauge"]}>
                            <div className={pongist.gauge}>
                                <div style={{width: `${speed}%`}}></div>
                            </div>
                            <div className={pongist.score}>{speed}</div>
                        </div>
                    </div>
                    <div className={pongist["stat-bloc"]}>
                        <div className={pongist["stat-name"]}>STRENGHT :</div>
                        <div className={pongist["stat-gauge"]}>
                            <div className={pongist.gauge}>
                                <div style={{width: `${strenght}%`}}></div>
                            </div>
                            <div className={pongist.score}>{strenght}</div>
                        </div>
                    </div>
                    <div className={pongist["stat-bloc"]}>
                        <div className={pongist["stat-name"]}>ENDURANCE :</div>
                        <div className={pongist["stat-gauge"]}>
                            <div className={pongist.gauge}>
                                <div style={{width: `${endurance}%`}}></div>
                            </div>
                            <div className={pongist.score}>{endurance}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={pongist["match-stat"]}>
                <div className={pongist.match}>M {game}</div>
                <div className={pongist.win}><span></span> {win}</div>
                <div className={pongist.loss}><span></span>  {loss}</div>
            </div>
        </div>  
    );
}