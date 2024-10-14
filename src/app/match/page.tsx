'use client'
import { Player } from "@/helpers/types";
import MatchClient from "./matchClient";
import { useContext } from "react";
import { PlayersContext } from "@/components/layouts/LayoutMain";
import { redirect } from 'next/navigation';


export default function Match() {
    const players: Player[] = useContext(PlayersContext).playersArray;
    const mainPlayer: Player =  useContext(PlayersContext).mainPlayer;
    if (mainPlayer.id === 0) redirect('/');
    const currentPlayer: Player = players.find(player => player.id === mainPlayer.id)!;

    return(
        <>
            <MatchClient oPlayers={players} oCurrentPlayer={currentPlayer}></MatchClient>
        </>
    )
}