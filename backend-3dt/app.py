from flask import Flask, request, jsonify

import json

app = Flask(__name__)


@app.route("/startGame")
def startGame():
    # give a socket for frontend to subscribe to
	# credentials
	# 

    pass
    
@app.route("/joinSocket")
def joinSocket():
	# when user wants to join socket
	# allow if correct credentiasl & have room for 2
	# disallow if 2 people are already subscribed
    pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
