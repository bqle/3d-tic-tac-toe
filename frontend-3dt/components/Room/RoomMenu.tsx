
import { useContext, useState } from "react"
import { Socket } from "socket.io-client"
import {SocketContext} from '../../context/SocketContext';

type RoomMenuProps = {
	socket: Socket | null,
	room: string | null,
	username: string | null,
	roomInfo: {} | null,
}

const RoomMenu = (props: RoomMenuProps) => {
	const [roomInput, setRoomInput] = useState('')

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
            width: '200px',
            height: 'auto',
			padding: '10px',
			borderRadius: '10px',
            color: 'white',
            zIndex: 1,
            textAlign: 'center',
            verticalAlign: 'middle'
        }}
        >
			{
			props.username &&
			<p className='menu-p'>
				User: {props.username}
			</p>
			}
			{!props.room && 
			<div>
				<div className="button" style={{
					marginBottom: '10px'
					
				}} onClick={() => {
					joinRoom()
				}}
				>
					<div className="slide"></div>
					<a>JOIN RANDOM ROOM</a>
				</div>
				<input type='text' name='room-name' className='input-room'
					onInput={(e) => {
						setRoomInput((e.target as HTMLTextAreaElement).value.toUpperCase());
					}}
					placeholder={"Room code..."}
				/>
				<div className="button" style={{
					marginBottom: '10px'
				}} onClick={() => {
					joinRoom(roomInput)
				}}>
					<div className="slide"></div>
					<a>JOIN ROOM</a>
				</div>
			</div>
			}
			{
			props.room && 
			<div>
				<p className="menu-p">Room: {props.room}</p>
				<div className="button" 
					onClick={() => {leaveRoom()}}>
						<div className="slide-back"></div>
					<a>LEAVE ROOM</a>
				</div>
			</div>
			}
			{
			opponent &&
			<p className="menu-p">Opponent: {opponent}</p>
			}
        </div>
    )
}

export default RoomMenu