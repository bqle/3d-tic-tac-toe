// import { Socket } from 'socket.io-client'
// import io from 'socket.io-client'

// class GameSocket  {
// 	socket : Socket;

// 	constructor() {
// 		this.socket = io(`${window.location.hostname}:5000`, {autoConnect: false});
// 		this.socket.on('connect', function() {
// 		  console.log('I am connected!')
// 		})
	
// 		this.socket.on('connect-response', function(message) {
// 		  if (username == null) {
// 			console.log('username is null')
// 			setUsername(message);
// 			newSocket.emit('join', {'username': message})
// 			console.log('username', message);
// 		  }
// 		})
	
// 		newSocket.on('join-response', function(message) {
// 		  console.log('a new user has joined')
// 		  console.log(message)
// 		  if (room == null) {
// 			setRoom(message['room'])
// 			setTile(message['tile'])
// 		  }
// 		})
	
// 		newSocket.on('move-played', function(message) {
// 		  console.log(message)
// 		})
// 	}

// }