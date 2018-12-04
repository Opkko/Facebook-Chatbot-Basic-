'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

var mongoose = require("mongoose")

mongoose.connect('mongodb://testbot:1313opkko@ds033123.mlab.com:33123/testbot')
var database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
  console.log('connected')
});




const AIMLInterpreter = require('aimlinterpreter')
let aimlInterpreter = new AIMLInterpreter({name:'Opkko', age:'1000'})
aimlInterpreter.loadAIMLFilesIntoArray(['./test.aiml.xml']) 	

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res){
	res.send("ok liao")
})

let token = "EAASuceKDAJcBAAqmMF9aiROyVxj5Ap3RmCXg1qJzhalOX7bIMw9yBCDL8HhaYyoCBR9JwTNXgiVhU7PgNPZCqwPHzakKD7jwPjEYSyPRlPAB3VpyYVS0xRl8FcWre0elF9xUhQwGElNk3drVpJSjYfsUKmMzlTRTEgASEmwZDZD"

// Facebook

app.get('/webhook/', function(req, res){
	if (req.query['hub.verify_token'] === "okay"){
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res)	 {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			aimlInterpreter.findAnswerInLoadedAIMLFiles(text,function(answer, wildCardArray, input){
			console.log(answer + ' | ' + wildCardArray + ' | ' + input)
			if(answer){
				sendText(sender,answer)
			}

			})
			//sendText(sender, "hello my name is chatbot42 and i am created on 2/4/2017")
			//sendText(sender, ans)
		}
	}
	res.sendStatus(200)

})


	
function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token : token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function(){
	console.log("running at port:" + app.get('port'))
})