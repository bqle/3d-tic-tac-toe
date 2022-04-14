import engineio
from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, send, emit, join_room, leave_room


import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, logger=True, engineio_logger=True)


@app.route("/")
def index():
	return render_template('main.html')

@socketio.on('connect')
def test_connect(auth):
	print('in here')
	emit('my response', {'data': 'Connected'})


@socketio.on('message')
def handle_message (message):
	print('received json', message)
	print(type(message))
	send (message)

@socketio.on('join')
def on_join(data):
	# can join a new game or an existing game

	username = data['username']
	room = data['room']
	print('attempting to join', username, room)
	join_room(room)
	send(username + ' has entered room ', to=room)

@socketio.on('leave')
def on_leave(data):
	# leave existing game
	username = data['username']
	room = data['room']
	leave_room(room)
	send(username + ' has left the room ', to=room)

if __name__ == '__main__':
    socketio.run(app, host='localhost', port=5000, debug=True)

