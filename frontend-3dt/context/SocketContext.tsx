import { createContext } from "react";
import internal from "stream";
import { Socket } from 'socket.io-client'

type SocketContextType = {
	socket: Socket | null,
	tile: string | null,
	joinRoom: (room?: string) => void,
	playMove: (i: number, j: number, k :number, tile: string) => void,
	leaveRoom: () => void
}

export const SocketContext = createContext<SocketContextType>(
    {
		socket: null,
		tile: null,
		joinRoom: () => {},
		playMove: (i: number, j: number, k :number, tile: string) => {},
		leaveRoom: () => {},
    }
);

