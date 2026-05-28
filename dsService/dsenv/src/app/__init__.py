from flask import Flask, request, jsonify

from service.messageService import MessageService

app = Flask(__name__)

messageService = MessageService()


@app.route('/v1/ds/message', methods=['POST'])
def handle_message():

    message = request.json.get('message')

    result = messageService.process_message(message)

    if result:
        return jsonify(result.model_dump())

    return jsonify({
        "message": "Not Bank SMS"
    })


@app.route('/', methods=['GET'])
def home():

    return "Hello world"


if __name__ == "__main__":

    app.run(
        host="localhost",
        port=8000,
        debug=True
    )