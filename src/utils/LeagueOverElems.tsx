
export function getRankSuffix (rank: number) {
    if (rank === 1) {
        return 'st';
    } else if (rank === 2) {
        return 'nd';
    } else if (rank === 3) {
        return 'rd';
    } else {
        return 'th';
    }
}

export function getMedal(rank: number) {
    if (rank === 1) {
        return (<div className="medal"><img className="gold" src="/img/medals.png"/></div>);
    } else if (rank === 2) {
        return (<div className="medal"><img className="silver" src="/img/medals.png"/></div>);
    } else if (rank === 3) {
        return (<div className="medal"><img className="bronze" src="/img/medals.png"/></div>);
    } else {
        return;
    }
}