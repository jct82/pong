import { Player } from "@/helpers/types";
import { getCurrentPlayer, getPlayers } from "@/helpers/actions";
import LayoutMain from "./LayoutMain";

interface Props {
    children: any;
};

export default async function LayoutWrapper({children}: Props) {
    // const playersequest: Promise<Player[]> = await getPlayers()
    const players: Promise<Player[]> =  await getPlayers();
    return(
        <div>
            <LayoutMain players={players} children={children}></LayoutMain>
            <main></main>
        </div> 
    )
}