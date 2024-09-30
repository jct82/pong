
'use client'
import { Player } from "@/helpers/types";
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import PlayerCard from '@/components/PlayerCard';
import "./player.css";

function displayPlayers(players: Player[]) {
    return players.map(plr => (
        <PlayerCard player={plr} key={plr.id}></PlayerCard>
    ));
}

export default function Pongist() {
    const players: Player[] = useContext(PlayersContext).playersArray;
    const playersJSX = displayPlayers(players);
    return(
        <>
            <div className="pongist-page">
                <div className="players">
                    {playersJSX}
                </div>
            </div>
        </>
    );
}