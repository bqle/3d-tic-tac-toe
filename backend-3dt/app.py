from argparse import Namespace
import engineio
from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, send, emit, join_room, leave_room, rooms
import flask_socketio
import random
import json
import string

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, logger=True, 
					engineio_logger=True,
					cors_allowed_origins='*')

"""
{room_name: {
		sid1: 'X',
		sid2: 'O'
	}
}

"""
rooms = {} 
"""
{
	sid: username
}
"""
usernames = {}

@app.route("/")
def index():
	return render_template('main.html')

@socketio.on('connect')
def test_connect():
	names = usernames.values()
	username = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 7))
	while (username in names) :
		username = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 7))

	usernames[request.sid] = username
	print(usernames[request.sid])
	
	print('connected')
	emit('connect-response', username)

def get_room_info(room):
	roomInfo = {}
	for sid in rooms[room]:
		print(usernames[sid])
		print(rooms[room][sid])
		roomInfo[usernames[sid]] = rooms[room][sid]
	return roomInfo


@socketio.on('join')
def on_join_room(data=None):
	# can join a new game or an existing game
	"""
	data = {
		'username': 'abc',
		'room'? : 'room_number',
		'tile'?: 'X'
	}
	"""
	if (data == None or 'username' not in data):
		return
	room = None
	if 'room' not in data or data['room'] not in rooms: 
		room = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 5))
		while (room in rooms): 
			room = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 5))
	else : 
		room = data['room']

	sid = request.sid
	# room = 'ABCDE'
	join_room(room, sid)

	if (room not in rooms):
		print('empty room')
		rooms[room] = {}
		rooms[room][sid] = 'X'
		room_info = get_room_info(room)
		# emit join-response to the joiner
		emit('join-response', {'username': usernames[sid],'room': room, 'tile': 'X', 'roomInfo': room_info}, room=request.sid)

	elif len(rooms[room]) == 1:
		print('room has one person')
		first_person = list(rooms[room].keys())[0]
		choice = ''
		if (rooms[room][first_person] == 'O'):
			choice = 'X'
		elif (rooms[room][first_person] == 'X'):
			choice = 'O'

		rooms[room][sid] = choice
		room_info = get_room_info(room)
		print('sockets in a room')
		for sid in rooms[room]:
			print(sid, rooms[room][sid])
		# emit join-response to the joiner
		emit('join-response', {'username': usernames[sid], 'room': room, 'tile': choice, 'roomInfo': room_info}, room=request.sid)
		# emit another-join-response to others in the room
		emit('another-join-response', {'username': usernames[sid], 'room': room, 'tile': choice, 'roomInfo': room_info}, room=room)

	

def get_room(sid):
	user_rooms = flask_socketio.rooms(sid=sid)
	user_rooms.remove(sid)
	if (len(user_rooms) >= 1):
		return user_rooms[0]
	else : 
		return None	

def leave_room(sid):
	# return bool : whether the room was deleted or not
	room = get_room(sid)
	if (room != None and room in rooms):
		rooms[room].pop(sid)
		if (len(rooms[room]) == 0):
			rooms.pop(room)
			return True
		elif (len(rooms[room]) == 1):
			return False


@socketio.on('leave-room')
def on_leave_room():
	sid = request.sid
	room = get_room(sid)
	if (room is not None):
		room_deleted = leave_room(sid)
		if (not room_deleted): 
			emit('user-left', {'roomInfo': get_room_info(room)}, room=room)
	

@socketio.on('disconnect')
def on_disconnect(data = None):
	print('received disconnect')
	# leave existing game
	# print(data['username'] + ' disconnected from ' + data['room'])
	sid = request.sid
	usernames.pop(sid)
	room = get_room(sid)
	if (room is not None):
		room_deleted = leave_room(sid)
		if (not room_deleted): 
			emit('user-left', usernames[sid], room=room)

@socketio.on('play-move')
def on_play_move(data):
	"""
	data = {
		'i': 0, 'j': 0, 'k': 0,
		'tile': 'X'
	}
	"""
	print('play move')
	room = get_room(request.sid)
	emit('move-played', data, room=room, skip_sid=request.sid)



if __name__ == '__main__':
    socketio.run(app, host='localhost', port=5000, debug=True)

