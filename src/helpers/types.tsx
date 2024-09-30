export interface Player {
    id: number;
    fullname: string;
    age: number;
    game: number;
    win: number;
    loss: number;
    series: string;
    accuracy: number;
    speed: number;
    strenght: number;
    endurance: number;
    points: number;
    rank: number | 0;
    isOpponent: boolean | true;
}

export interface setMainPlayer {
    (playerId: number): void;
}

export interface PlayerProvider {
    playersArray: Player[];
    mainPlayer: Player;
    setMainPlayer: setMainPlayer;
}

export type Match = number[];

export type Calendar = Array<Array<Match>>;
