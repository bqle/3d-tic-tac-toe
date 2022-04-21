import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import LargeBox from '../components/LargeBox'
import CustomStars from '../components/CustomStars'
import { Text } from '@react-three/drei'
import fonts from '../public/fonts.js'
import {colors} from '../public/constants.js'
import HelpMenu from '../components/Help/HelpMenu'
import RoomMenu from '../components/Room/RoomMenu'
import io from 'socket.io-client'
import { Socket } from 'socket.io-client'
import { SocketContext } from "../context/SocketContext"



const Scene = () => {
  const [socket, setSocket] = useState<null | Socket>(null);

  const [username, setUsername] = useState<null | string>(null); // determine if socket is connected
  const [room, setRoom] = useState<null | string>(null);
  const [roomInfo, setRoomInfo] = useState<null | {}>(null);
  const [tile, setTile] = useState<null | string>(null); // tile that this player can place

  useEffect(() => {
    const newSocket = io(`${window.location.hostname}:5000`, 
                        {autoConnect: true, 
                        secure: true,
                        reconnection: true,
                        forceNew: false
                        });
    newSocket.on('connect', function() {
      console.log('I am connected!')
    })

    newSocket.on('connect-response', function(message) {
      if (username == null) {
        setUsername(message);
        // newSocket.emit('join', {'username': message})
        console.log('username', message);
      }
    })

    newSocket.on('user-left', function(message) {
      console.log(message);
      setRoomInfo(message['roomInfo'])
    })

    newSocket.on('join-response', function(message) {
      console.log('you have joined')
      console.log('new info', message)
      console.log('current info', room, tile)
      if (room === null) { // joining an empty romo
        console.log('chaging game statsu')
        setRoom(message['room'])
        setTile(message['tile'])
        setRoomInfo(message['roomInfo'])
      } 
    })

    newSocket.on('another-join-response', function(message) {
      console.log('another has joined')
      console.log('new info', message)
      console.log('current info', room, tile) 
      setRoomInfo(message['roomInfo'])

    })

    setSocket(newSocket);
    console.log('new socket created')
    return () => {newSocket.close();}
  }, [])

  const socketJoinRoom = () => {
    if ('room' != null) {
      console.log('room is not empty')
      socket?.emit('join', {'username': username, 'room': room})
    } else {
      console.log('room is empty')
      socket?.emit('join', {'username': username})
    }
    console.log('joined room')

  }

  const socketPlayMove = (i: number, j: number, k: number, tile: string) => {
    console.log(room, username, socket== null)
    socket?.emit('play-move', {'i': i, 'j': j, 'k': k, 'tile': tile})
  }

  const socketLeaveRoom = () => {
    setRoom(null)
    setTile(null)
    setRoomInfo(null)
    console.log(room)
    socket?.emit('leave-room')
  }

  return (
    <div>
      <HelpMenu />
      <SocketContext.Provider value={{
          socket: socket,
          tile: tile, 
          joinRoom: socketJoinRoom, 
          playMove: socketPlayMove,
          leaveRoom: socketLeaveRoom}}>
        <RoomMenu socket={socket} room={room} username={username}
                  roomInfo={roomInfo}
        />
      </SocketContext.Provider>
      <Canvas camera={{position: [0, 0, 25]}}
        style={{position: 'absolute',
                width: '100%',
                height: '100%'
              }}
      >
        <color attach="background" args={["black"]}></color>
        <group>
          <Text font={fonts.Philosopher} color={colors.brightOrange} anchorX='center' anchorY='middle'
            position={[0, 5, 0]}
            fontSize={2} >
              Welcome to
          </Text>
          <Text font={fonts.Philosopher} color={colors.brightOrange} anchorX='center' anchorY='middle'
            position={[0, 3, 0]}
            fontSize={2} >
              3D tic-tac-toe!
          </Text>
        </group>
        <OrbitControls target={[0, 0, 0]} />
        {/* <Stars radius={100} depth={1} count={5000} factor={4} saturation={0}
          // fade
        />  */}
        <CustomStars count={1500}></CustomStars>
        {/* <Cloud /> */}
        {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.5} /> */}
        
        <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
        <ambientLight intensity={0.5} />
        {/* <mesh>
          <sphereGeometry attach="geometry" args={[1000, 16, 16]}/>
          <meshStandardMaterial attach="material"
                      color={constants.yellowEdge}
        
                      />
        </mesh> */}
        <SocketContext.Provider value={{
          socket: socket,
          tile: tile,
          joinRoom: socketJoinRoom, 
          playMove: socketPlayMove,
          leaveRoom: socketLeaveRoom}}>
          <LargeBox />
        </SocketContext.Provider>
      </Canvas>
    </div>
  )
};


export default Scene
