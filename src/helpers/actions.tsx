
'use server'
import { revalidatePath } from 'next/cache';
import { Player } from './types';

export async function getPlayers() {
    const res = await fetch("http://localhost:3004/players");
    if(!res.ok){
      throw new Error('no pongists')
    }
    revalidatePath('/');
    return res.json();
}

export async function getCurrentPlayer() {
  const res = await fetch("http://localhost:3004/playerMain");
  if(!res.ok){
    throw new Error('no pongists')
  }
  revalidatePath('/');
  revalidatePath('/pongists');
  revalidatePath('/match');
  return res.json();
}

export async function setPlayer(player: Player) {
  const {id, fullname, age, game, win, loss, series, accuracy, speed, strenght, endurance, points} = player;
  try{
    const res = await fetch("http://localhost:3004/playerMain", {
        method:'PATCH',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          fullname,
          age,
          game,
          win,
          loss,
          series,
          accuracy,
          speed,
          strenght,
          endurance,
          points
        })
    });
    if(!res.ok){
        throw new Error(`${res.status} ${res.statusText}`)
    }
  } catch(error){
      console.log('ERRROR', error);
      return {message: "qu'est ce qui se passe ???"}
  }
  // revalidatePath('/');
  revalidatePath('/pongists');
}

export async function setResult(player: Player) {
  const {id, game, win, loss, series, points} = player;
  try{
    const res = await fetch(`http://localhost:3004/players/${id}`, {
        method:'PATCH',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            game,
            win,
            loss,
            series,
            points
        })
    });
    if(!res.ok){
        throw new Error(`${res.status} ${res.statusText}`)
    }
  } catch(error){
      console.log('ERRROR', error);
      return {message: "qu'est ce qui se passe ???"}
  }
  revalidatePath('/');
  revalidatePath('/pongists');
}

export async function setPlayerResult(player: Player) {
  const {id, fullname, age, game, win, loss, series, accuracy, speed, strenght, endurance, points} = player;
  try{
    const res = await fetch("http://localhost:3004/playerMain", {
        method:'PATCH',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          fullname,
          age,
          game,
          win,
          loss,
          series,
          accuracy,
          speed,
          strenght,
          endurance,
          points
        })
    });
    if(!res.ok){
        throw new Error(`${res.status} ${res.statusText}`)
    }
  } catch(error){
      console.log('ERRROR', error);
      return {message: "qu'est ce qui se passe ???"}
  }
  revalidatePath('/');
  revalidatePath('/pongists');
}

