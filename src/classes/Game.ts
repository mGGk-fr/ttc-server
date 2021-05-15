import { v4 as uuidv4 } from 'uuid';
import Player from "./Player";

export default class Game {
    firstPlayer: Player;
    secondPlayer: Player;
    uuid: string;

    constructor(firstPlayer: Player, secondPlayer: Player) {
        this.firstPlayer = firstPlayer;
        this.secondPlayer = secondPlayer;
        this.uuid = uuidv4();
    }
}