const Traffic = require('./traffic')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
var snmp = require('snmp-native')
var moment = require('moment')
var axios = require('axios')

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 8000))
app.use(bodyParser.urlencoded({extended: false}))
moment.locale('th')

setTime()
function setTime(){
	let min =  moment().format("LT") 
	min = min.substring(min.search(":")+1,min.length)
	min = parseInt(min) % 5

	if(min == 0){
		console.log('yes', moment().format("LT"))
		run()
	}else{
		console.log('no', moment().format("LT"))
		setTimeout(function(){ setTime() },1000*60*1) 
	}
}

function run (){
	let traffic = Traffic.get()
    setTimeout(function(){
    	sendInterface(traffic)
    },17000)

	setInterval(function(){
		let traffic = Traffic.get()
	    setTimeout(function(){
	    	sendInterface(traffic)
	    },17000)
	},1000*60*5)
}
//***************** Function sendInterface ********************
function sendInterface (data_) {   
	let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]	
    postSheet ("1eZwYLOMnsvuNNr9tg27-BUiQQMxOXsyQ76XeWFmI4xc",data,"sheet1!A:C") 
}
 //***************** Function Post ********************
 function postSheet (idSheet,data_) {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios({
    method: 'post',
    url: 'https://postapi.herokuapp.com/',
    data: JSON.stringify({
      "KeyID": idSheet,
      "column": "sheet1!A:C", 
      "valuesData": data_
    })
  }).then(function(response) {   
    if (response.data != 'OK') {
      console.log('Error !!',response.data)
    }else{   
      console.log('Post Success!!!!!!!!!')
    }    
  })
}

app.listen(app.get('port'), function () {
	console.log('run at port', app.get('port'), 'app.js')
})