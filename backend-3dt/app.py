import engineio
from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, send, emit, join_room, leave_room, rooms
import flask_socketio

import random
import json
import string

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, logger=True, engineio_logger=True)

rooms = {}
usernames = set()

@app.route("/")
def index():
	return render_template('main.html')

@socketio.on('connect')
def test_connect():
	username = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 7))
	while (username in usernames) :
		username = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 7))
		usernames.add(username)
	

	emit('connect-response', username)

@socketio.on('join')
def on_join_room(data):
	# can join a new game or an existing game
	"""
	data = {
		'username': 'abc',
		'room'? : 'room_number',
		'tile'?: 'X'
	}
	"""
	room = None
	if 'room' not in data: 
		room = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 5))
		while (room in rooms): 
			room = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 5))
	else : 
		room = data['room']

	sid = request.sid
	room = 'ABCDE'
	if (room not in rooms):
		print('empty room')
		join_room(room)
		rooms[room] = {}
		rooms[room][sid] = 'X'
		emit('join-response', {'room': room, 'tile': 'X'}, to=room)
	elif len(rooms[room]) == 1:
		join_room(room)
		first_person = list(rooms[room].keys())[0]
		choice = ''

		if (rooms[room][first_person] == 'O'):
			choice = 'X'
		elif (rooms[room][first_person] == 'X'):
			choice = 'O'

		rooms[room][sid] = choice
		
		emit('join-response', {'room': room, 'tile': choice}, to=room)
	else: # do nothing if the room is full
		pass

def get_room(sid):
	user_rooms = flask_socketio.rooms(sid=sid)
	user_rooms.remove(sid)
	if (len(user_rooms) >= 1):
		return user_rooms[0]
	else : 
		return None

@socketio.on('disconnect')
def on_disconnect(data = None):
	# leave existing game
	# print(data['username'] + ' disconnected from ' + data['room'])
	sid = request.sid
	room = get_room(sid)
	if (room != None and room in rooms):
		rooms[room].pop(sid)
		if (len(rooms[room]) == 0):
			rooms.pop(room)
		elif (len(rooms[room]) == 1):
			emit ('user-left', to=room)

@socketio.on('play-move')
def on_play_move(data):
	"""
	data = {
		'i': 0, 'j': 0, 'k': 0,
		'tile': 'X'
	}
	"""
	room = get_room(request.sid)
	emit('move-played', data, to=room)



if __name__ == '__main__':
    socketio.run(app, host='localhost', port=5000, debug=True)

