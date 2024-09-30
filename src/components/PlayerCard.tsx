
'use client'
import { Player } from "@/helpers/types";
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import playerImgPath from "@/utils/GetImgPlayer";

import "@/app/pongists/player.css";

interface Props {
    player: Player;
};

export default function PlayerCard({player}: Props) {
    const {id, fullname, age, accuracy, speed, strenght, endurance, game, win, loss} = player;
    const currentPlayer: Player= useContext(PlayersContext).mainPlayer.id;
    const setPlayerCopy = useContext(PlayersContext).setMainPlayer;
    return(
        <div className={`player ${currentPlayer === id ? "current" : ""}`}>
            <div className="info">
                <div className="rank">{id}</div>
                <div className="name">{fullname}</div>
                <div className="age">{age}<span>yr</span></div>
                {
                    currentPlayer !== id && 
                    <button 
                        className="select-player" 
                        onClick={() => {setPlayerCopy(Number(id))}}>
                        SELECT
                    </button>
                }
            </div>
            <div className="main-info">
                <div className="photo">
                    <img src={`/img/${playerImgPath(fullname)}.png`}/>
                </div>
                <div className="stat">
                    <div className="stat-bloc">
                        <div className="stat-name">ACCURACY :</div>
                        <div className="stat-gauge">
                            <div className="gauge">
                                <div style={{width: `${accuracy}%`}}></div>
                            </div>
                            <div className="score">{accuracy}</div>
                        </div>
                    </div>
                    <div className="stat-bloc">
                        <div className="stat-name">SPEED :</div>
                        <div className="stat-gauge">
                            <div className="gauge">
                                <div style={{width: `${speed}%`}}></div>
                            </div>
                            <div className="score">{speed}</div>
                        </div>
                    </div>
                    <div className="stat-bloc">
                        <div className="stat-name">STRENGHT :</div>
                        <div className="stat-gauge">
                            <div className="gauge">
                                <div style={{width: `${strenght}%`}}></div>
                            </div>
                            <div className="score">{strenght}</div>
                        </div>
                    </div>
                    <div className="stat-bloc">
                        <div className="stat-name">ENDURANCE :</div>
                        <div className="stat-gauge">
                            <div className="gauge">
                                <div style={{width: `${endurance}%`}}></div>
                            </div>
                            <div className="score">{endurance}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="match-stat">
                <div className="match">M {game}</div>
                <div className="win"><span></span> {win}</div>
                <div className="loss"><span></span>  {loss}</div>
            </div>
        </div>  
    );
}