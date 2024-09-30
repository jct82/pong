'use client'
import { Player } from "@/helpers/types";
import MatchClient from "./matchClient";
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import "./styles.css";


export default function Match() {
    const players: Player[] = useContext(PlayersContext).playersArray;
    const mainPlayer: Player =  useContext(PlayersContext).mainPlayer;
    const currentPlayer = players.find(player => player.id === mainPlayer.id);
    return(
        <>
            <MatchClient oPlayers={players} oCurrentPlayer={currentPlayer}></MatchClient>
        </>
    )
}