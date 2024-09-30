'use client'
import { useState, createContext } from "react";
import { Player, PlayerProvider } from "@/helpers/types";
import Header from "@/components/Header";

interface Props {
    players: Player[];
    children:any;
};

const defaultPlayer: Player = {
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
    rank : 0,
    isOpponent : false
}

export const PlayersContext = createContext({players:[], currentPlayer:{}});

export function setPlayer(playersTab: Player[], playerId: number) {
    const player = playersTab.find(player => Number(playerId) === Number(player.id));
    return player ?? defaultPlayer;
}

export default function LayoutMain({players, children}: Props) {
    const [playersTab, setPlayersTab] = useState<Player[]>(players);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(defaultPlayer);
    const updateCurrentPlayer = (playerId: number = 0) => (setCurrentPlayer(setPlayer(playersTab, playerId)));
    const updatePlayersTab = (newPlayers: Player[]) => (setPlayersTab(newPlayers));
    const currentPlayerName: string = currentPlayer.fullname;
    return(
        <div>
            <PlayersContext.Provider value={
                {
                    playersArray: playersTab,
                    mainPlayer: currentPlayer, 
                    setMainPlayer: updateCurrentPlayer,
                    setAllPlayers: updatePlayersTab
                }
            }>
                <Header playerName={currentPlayerName}></Header>
                {children}
            </PlayersContext.Provider>
        </div> 
    )
}