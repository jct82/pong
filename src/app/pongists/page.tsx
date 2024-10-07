
'use client'
import { Player } from "@/helpers/types";
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import PlayerCard from '@/components/PlayerCard';
import pongist from "./styles.module.css";

function displayPlayers(players: Player[]) {
    return players.map(plr => (
        <PlayerCard player={plr} key={plr.id}></PlayerCard>
    ));
}

export default function Pongist() {
    const players: Player[] = useContext(PlayersContext).playersArray;
    const mainPlayer = useContext(PlayersContext).mainPlayer;
    const currentPlayer: Player = players.find(plr => mainPlayer.id === plr.id) || mainPlayer;
    if (currentPlayer.game === 9) {
        const resetPlayers = players.map(plr => ({
            ...plr,
            game: 0,
            win: 0,
            loss: 0,
            series: "-----",
            points: 0
        }));
        const resetPlayer = {
            id: 0,
            fullname : '',
            age : 0,
            game : 0,
            win : 0,
            loss : 0,
            series : '',
            accuracy : 0,
            speed : 0,
            strenght : 0,
            endurance : 0,
            points : 0,
            isOpponent : false
        }
        useContext(PlayersContext).setAllPlayers(resetPlayers);
        useContext(PlayersContext).setMainPlayer(resetPlayer);
    }
    const playersJSX = displayPlayers(players);
    return(
        <>
            <div className={pongist["pongist-page"]}>
                <div className={pongist.players}>
                    {playersJSX}
                </div>
            </div>
        </>
    );
}