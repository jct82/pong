
'use client'
import playerImgPath from "@/utils/GetImgPlayer";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import "@/app/page.css";

interface Props {
    playerName: string
};


export default function Header({playerName}: Props) {
    const pathname = usePathname();
    return(
        <div className="header">
            <div className="current-player">
                {playerName.length > 0 &&
                    <>
                        <div className="photo">
                            <img src={`/img/${playerImgPath(playerName)}.png`}/>
                        </div>
                        <span>{playerName}</span>
                    </>
                }
            </div>
            <div className="logo">
                <Link href="/">PONG PRO</Link>
            </div>
            <div className="menu">
                {pathname !== '/pongists' && <span><Link href="/pongists">CHOOSE PLAYER</Link></span>}
                {pathname !== '/match' && playerName.length > 0 && <span><Link href="/match">PLAY MATCH</Link></span>}
            </div>
        </div>
    )
}