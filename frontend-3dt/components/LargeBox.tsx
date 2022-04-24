import React, { useMemo, useRef, useState, useCallback, useEffect, useContext } from 'react'
import * as THREE from 'three'
import SingleBox from './SingleBox'
import {SquareStatus} from '../enums/SquareStatus'
import { SocketContext } from '../context/SocketContext';
import { Socket } from "socket.io-client"
import { _roots } from '@react-three/fiber';
import {GameStatus} from '../enums/GameStatus'

const deg2rad = (degrees:number) => degrees * (Math.PI / 180);

const boxSize = 1;
const shiftFactor = 1


type LargeBoxProps = JSX.IntrinsicElements['mesh'] & {
  cubeInfo?: Array<SquareStatus>,
  changeGameStatus: (status: GameStatus) => void,
}


function LargeBox(props: LargeBoxProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [nextTile, setNextTile] = useState(SquareStatus.X)
  const [gameState, setGameState] = useState([[[SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY],
                                                 [SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY],
                                                 [SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY]],
                                                [[SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY],
                                                 [SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY],
                                                 [SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY]],
                                                [[SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY],
                                                 [SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY],
                                                 [SquareStatus.EMPTY, SquareStatus.EMPTY, SquareStatus.EMPTY]]
                                        ]);

  const [highlightCoord, setHighlightCoord] = useState([0, 0, 2]);
  const {socket, tile, joinRoom, playMove, leaveRoom} = useContext(SocketContext)

  // can be improved
  const arrayOfGeoms = useMemo(() => {
    let array = new Array(27);
    for (let i = 0 ; i < 27; i++) {
      array[i] = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    }
    return array}, [])

  const cloneGameState = useCallback(() => {
    let clone = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(3).fill(0)))
    for (let i = 0 ; i < 3; i++) {
      for (let j = 0 ; j < 3; j++) {
        for (let k = 0 ; k < 3 ; k++) {
          clone[i][j][k] = gameState[i][j][k];
        }
      }
    }
    return clone;
  }, [gameState])

  const checkRow = useCallback((i1, j1, k1, i2, j2, k2, i3, j3, k3) => {
    if (gameState[i1][j1][k1] != SquareStatus.EMPTY 
      && gameState[i1][j1][k1] == gameState[i2][j2][k2]
      && gameState[i2][j2][k2] == gameState[i3][j3][k3]) {
      return true;
    } else {
      return false;
    }
  }, [gameState])

  const checkGameStatus = useCallback(() => {
    var victor = SquareStatus.EMPTY;
    // check all three orthogonal directions
    for (let i = 0 ; i < 3; i++) {
      for (let j = 0 ; j < 3; j++) {
        if (checkRow(i, j, 0, i, j, 1, i, j, 2)) {
            victor = gameState[i][j][0];
            break;
          }
      }
      if (victor != SquareStatus.EMPTY) {
        break;
      }
    }

    for (let j = 0 ; j < 3; j++) {
      for (let k = 0 ; k < 3; k++) {
        if (checkRow(0, j, k, 1, j, k, 2, j, k)) {
            victor = gameState[0][j][k];
            break;
          }
      }
      if (victor != SquareStatus.EMPTY) {
        break;
      }
    }

    for (let i = 0 ; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        if (checkRow(i, 0, k, i, 1, k, i, 2, k)) {
            victor = gameState[i][0][k];
            break;
          }
      }
      if (victor != SquareStatus.EMPTY) {
        break;
      }
    }

    // diagonal on parallel planes
    for (let i = 0 ; i < 3 ; i++) {
      if (checkRow(i, 0, 0, i, 1, 1, i, 2, 2)) {
        victor = gameState[i][0][0];
      }
    
      if (checkRow(i, 2, 0, i, 1, 1, i, 0, 2)) {
        victor = gameState[i][2][0];
      }
    }
    
    for (let j = 0 ; j < 3 ; j++) {
      if (checkRow(0, j, 0, 1, j, 1, 2, j, 2)) {
        victor = gameState[0][j][0];
      }
      

      if (checkRow(2, j, 0, 1, j, 1, 0, j, 2)) {
        console.log('FOUND HERE!')
        victor = gameState[2][j][0];
      }
    }

    for (let k = 0 ; k < 3 ; k++) {
      if (checkRow(0, 0, k, 1, 1, k, 2, 2, k)) {
        victor = gameState[0][0][k];
      }
      
      if (checkRow(2, 0, k, 1, 1, k, 0, 2, k)) {
        victor = gameState[2][0][k];
      }
    }
  
    // body diagonals
    if (checkRow(0, 0, 0, 1, 1, 1, 2, 2, 2)) {
      victor = gameState[0][0][0];
    }
    if (checkRow(0, 0, 2, 1, 1, 1, 2, 2, 0)) {
      victor = gameState[0][0][2];
    }
    if (checkRow(2, 0, 0, 1, 1, 1, 0, 2, 2)) {
      victor = gameState[2][0][0];
    }
    if (checkRow(0, 2, 0, 1, 1, 1, 2, 0, 2)) {
      victor = gameState[0][2][0];
    }
    if (victor == SquareStatus.X) {
      return GameStatus.X;
    } else if (victor == SquareStatus.O){
      return GameStatus.O;
    } else if (victor == SquareStatus.EMPTY) {
      for (let i = 0 ; i < 3; i++) {
        for (let j = 0 ; j < 3; j++) {
          for (let k = 0 ; k < 3; k++) {
            if (gameState[i][j][k] == SquareStatus.EMPTY) {
              return GameStatus.MENU
            }
          }
        }
      }
      return GameStatus.DRAW
    }
  }, [checkRow, gameState])

  const clickCenter = useCallback((event) => {
    setHighlightCoord([1, 1, 1]);
  }, [])

  const handleUserKeyPress = useCallback(event => {
    const code = event.code;
    var i = highlightCoord[0];
    var j = highlightCoord[1];
    var k = highlightCoord[2];
    if (code === 'ArrowLeft') { // left arrow - decrease x
      if (i > 0) {
        setHighlightCoord([i -1, j, k])
      }
    } else if (code === 'ArrowUp') { // up arrow -  increase y
      if (j < 2) {
        setHighlightCoord([i, j + 1, k])
      }
    } else if (code === 'ArrowRight') { // right arrow - increase x
      if (i < 2) {
        setHighlightCoord([i + 1, j, k])
      }
    } else if (code === 'ArrowDown') { // down arrow - decrease y
      if (j > 0) {
        setHighlightCoord([i , j - 1, k])
      }
    } else if (code === 'KeyQ') { // q - increase z
      if (k < 2) {
        setHighlightCoord([i , j, k + 1])
      }
    } else if (code === 'KeyE') { // e - decrease z
      if (k > 0) {
        setHighlightCoord([i , j, k - 1])
      }
    } else if (code === 'Enter') {
      console.log('ENTER!')
      let clone = cloneGameState()
      if (clone[i][j][k] === SquareStatus.EMPTY) {
        console.log('EMPTY!')
        clone[i][j][k] = nextTile
        console.log(nextTile.valueOf())
        console.log(tile?.valueOf())
        if (nextTile.valueOf() === tile) {
          if (nextTile === SquareStatus.O) {
            playMove(i, j, k, 'O')
            setNextTile(SquareStatus.X)
          } else {
            playMove(i, j, k, 'X')
            setNextTile(SquareStatus.O)  
          }
          setGameState(clone)
        }
      }
    } else if (code === 'KeyT') {
      leaveRoom()
    } else if (code === 'KeyC') {
    }
  }, [highlightCoord, gameState, nextTile, leaveRoom, playMove, cloneGameState, checkGameStatus])

  useEffect(() => {
    let winner = checkGameStatus()
    if (winner == GameStatus.O) {
      props.changeGameStatus(GameStatus.O)
    } else if (winner == GameStatus.X){
      props.changeGameStatus(GameStatus.X)
    }
  }, [checkGameStatus, props])

  useEffect(() => {
    socket?.on('move-played', function(message) {
      console.log(message);
      let i = message['i']
      let j = message['j']
      let k = message['k']
      let newTile = message['tile']
      console.log(i, j, k, newTile)
      if (nextTile.valueOf() === newTile && gameState[i][j][k] === SquareStatus.EMPTY) { // tile is indeed played by opponent
        let clone = cloneGameState()
        clone[i][j][k] = nextTile;
        
        setGameState(clone)
        let next = nextTile === SquareStatus.O ? SquareStatus.X : SquareStatus.O;
        setNextTile(next)
      }
      
    })
  }, [gameState, nextTile, setGameState, setNextTile, socket, cloneGameState, joinRoom])

  useEffect(() => {

    window.addEventListener('keydown', handleUserKeyPress);
    window.addEventListener('dblclick', clickCenter);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
      window.removeEventListener('dblclick', clickCenter);
    };
  }, [handleUserKeyPress, clickCenter])


  function updateHighlightCoord(i : number, j: number, k: number) {
    console.log(i, j, k);
    setHighlightCoord([i, j, k]);
  }
  
  const staticCube = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(3).fill(0)))


  return (
    <mesh rotation={[deg2rad(0), deg2rad(0), deg2rad(0)]}
      {...props}
      ref={mesh}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      >
      {arrayOfGeoms.map(
        (x, i) => (
                <lineSegments key={i} position={[Math.floor(i/9) - boxSize * shiftFactor, Math.floor(i %9 / 3) - boxSize * shiftFactor, (i%3) - boxSize * shiftFactor]}>
                  <edgesGeometry attach="geometry" args={[x]}></edgesGeometry>
                  <lineBasicMaterial color="#debd3c" attach="material" />
                </lineSegments>
              )
        )}
        {staticCube.map(
        (iValue, i) => (
          iValue.map(
            (jValue, j) => (
              jValue.map(
                (_, k) => (
                  <SingleBox key={i + ' ' + j + ' ' + k} position={[i - boxSize * shiftFactor, j - boxSize * shiftFactor, k - boxSize * shiftFactor]}
                    highlightStatus = {(i === highlightCoord[0] 
                      && j === highlightCoord[1] 
                      && k === highlightCoord[2]) ? true: false}
                    boxStatus = {gameState[i][j][k]}
                    updateHighlightCoord = {() => updateHighlightCoord(i, j, k)}
                  ></SingleBox>
                )
                )
              )
            )
          )
        )}
      
        
    </mesh>
  )
}

export default LargeBox