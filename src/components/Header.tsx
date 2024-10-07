
'use client'
import { Player } from "@/helpers/types";
import playerImgPath from "@/utils/GetImgPlayer";
import { usePathname } from 'next/navigation';
import Link from "next/link";

interface Props {
    currentPlayer: Player;
};


export default function Header({currentPlayer}: Props) {
    const pathname = usePathname();
    return(
        <div className="header">
            <div className="current-player">
                {currentPlayer.fullname.length > 0 &&
                    <>
                        <div className="photo">
                            <img src={`/img/${playerImgPath(currentPlayer.fullname)}.png`}/>
                        </div>
                        <span>{currentPlayer.fullname}</span>
                    </>
                }
            </div>
            <div className="logo">
                <Link href="/">PONG PRO</Link>
            </div>
            <div className="menu">
                {pathname !== '/pongists' && <span><Link href="/pongists">CHOOSE PLAYER</Link></span>}
                {pathname !== '/match' && currentPlayer.fullname.length > 0  && currentPlayer.game < 9 && <span><Link href="/match">PLAY MATCH</Link></span>}
            </div>
        </div>
    )
}