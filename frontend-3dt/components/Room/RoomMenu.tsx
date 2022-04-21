
import { useContext } from "react"
	import { Socket } from "socket.io-client"
import {SocketContext} from '../../context/SocketContext';

type RoomMenuProps = {
	socket: Socket | null,
	room: string | null,
	username: string | null,
	roomInfo: {} | null,
}

const RoomMenu = (props: RoomMenuProps) => {

	const {joinRoom, playMove, leaveRoom} = useContext(SocketContext)

	var opponent: string | null = null;
	if (props.roomInfo && Object.keys(props.roomInfo).length == 2) {
		for (const [key, value] of Object.entries<string>(props.roomInfo)) {
			if (key != props.username) {
				opponent = key;
				break;
			}
		}
	} 
	
    return (
        <div style={
            {position:'fixed',
            top: '10px',
            right: '10px',
            width: '110px',
            height: '50px',
            color: 'white',
            zIndex: 1,
            textAlign: 'center',
            verticalAlign: 'middle'
        }}
        >
			{
			props.username &&
			<p>
				User: {props.username}
			</p>
			}
			{!props.room && 
			<div>
				<button style={{
					marginBottom: '10px'
				}} onClick={() => {
					joinRoom()
				}}
				>
					Join Random Room 
				</button>
				<input type='text' name='room-name'
					style={{
						width: '100%'
					}}
				/>
				<button>
					Join Room
				</button>
			</div>
			}
			{
			props.room && 
			<div>
				<p>Room: {props.room}</p> 
				<button onClick={() => {leaveRoom()}}>
					Leave Room
				</button>
			</div>
			}
			{
			opponent &&
			<p>Opponent: {opponent}</p>
			}
        </div>
    )
}

export default RoomMenu