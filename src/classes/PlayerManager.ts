import Player from './Player';
import PlayerEvents from '../utils/PlayerEvents';
import { decodeMessage, encodeMessage } from '../utils/Message';
import Game from "./Game";
import * as WebSocket from 'ws';

export default class PlayerManager {
  players: Player[];
  games: Game[];

  constructor() {
    this.players = [];
    this.games = [];
  }

  listenForPlayerManagerEvents(ws: WebSocket): void {
    ws.on('message', (message: string) => {
      const data = decodeMessage(message);
      switch (data.type) {
        case PlayerEvents.REGISTR_PLAYER:
          this.registerPlayer(data.data.pseudo, ws);
          break;
        case PlayerEvents.GET_PLAYER_LIST:
          ws.send(
            encodeMessage(PlayerEvents.GET_PLAYER_LIST, {
              list: this.getPlayerList(),
            })
          );
          break;
        case PlayerEvents.ASK_DUEL:
          if(!this.playerIsInPlay(data.data.initialPlayer) && !this.playerIsInPlay(data.data.invitedPlayer)) {
            const newGame = new Game(data.data.initialPlayer, data.data.invitedPlayer);
            console.log(`Created new game with id : ${newGame.uuid}`);
          }
          break;
        default:
          console.log(`Got Unknown event ${data.type}`);
      }
    });
  }

  registerPlayer(pseudo: string, ws: WebSocket): void {
    const newPlayer = new Player(pseudo, ws, this.handlePlayerLogout.bind(this));
    this.players.forEach((player) => {
      player.ws.send(encodeMessage(PlayerEvents.NEW_PLAYER, {
        name: newPlayer.name,
        uuid: newPlayer.uuid,
      }));
    });
    this.players.push(newPlayer);
  }

  handlePlayerLogout(uuid: string): void{
    this.players = this.players.filter(player => player.uuid !== uuid);
    this.players.forEach(player => {
      player.ws.send(encodeMessage(PlayerEvents.PLAYER_LEFT, {
        uuid
      }));
    })
  }

  getPlayerList(): Array<unknown> {
    return this.players.map((player) => {
      return {
        name: player.name,
        uuid: player.uuid,
      };
    });
  }

  playerIsInPlay(player: Player): boolean {
    return this.games.some(game => {
      return game.firstPlayer.uuid === player.uuid || game.secondPlayer.uuid
    })
  }
}
