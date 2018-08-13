const Detail = require('./detail')

const Device = require('./device')

const Toprank = require('./toprank')

//const Traffic = require('./traffic')

//const Log = require('./event_log')



var express = require('express')

var bodyParser = require('body-parser')

var app = express()

var cors = require('cors')

var snmp = require('snmp-native')

var moment = require('moment')

var axios = require('axios')

app.use(bodyParser.json())

app.set('port', (process.env.PORT || 9000))

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

    //Log.get()

    //*********** 1 *************

    let detail = Detail.get()

    setTimeout(function(){

    sendDetail(detail)

    },9000)

    //*********** 2 *************

    let toprank = Toprank.get()

    setTimeout(function(){

    sendToprank(toprank)

    },11000)

    //*********** 3 *************

    let device = Device.get()

    setTimeout(function(){

    sendDevice(device[0])

    sendRatio(device[1])

    sendSw4503(device[2])

    sendInterfaceDevice(device[3])

    },17000)

    //*********** 4 *************

    // let traffic = Traffic.get()

    // setTimeout(function(){

    //   sendInterface(traffic)

    // },17000)



    setInterval(function(){

        //*********** 1 *************

        let detail = Detail.get()

        setTimeout(function(){

        sendDetail(detail)

        },10000)

        //*********** 2 *************

        let toprank = Toprank.get()

        setTimeout(function(){

        sendToprank(toprank)

        },11000)

        //*********** 3 *************

        let device = Device.get()

        setTimeout(function(){

        sendDevice(device[0])

        sendRatio(device[1])

        sendSw4503(device[2])

        sendInterfaceDevice(device[3])

        },17000)

        //*********** 4 *************

        // let traffic = Traffic.get()

        // setTimeout(function(){

        //   sendInterface(traffic)

        // },17000)



    },1000*60*5)

}





//***************** Function post_device ********************

function sendDetail (data_) {

let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]

postSheet ("1USfbjHmVE0vpOPvq8mDpGbad-zX6PTDxUeQBDlcs6JI",data,"sheet1!A:C")

}

//***************** Function sendDetail ********************

function sendDevice (data_) {

let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]

postSheet ("1WXmhTnJ9Dw6ana0tqtrV1mq2tyzM6TeErNA-_6aZ2fA",data,"sheet1!A:C")

}

//***************** Function sendDetail ********************

function sendInterfaceDevice (data_) {

let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]

postSheet ("10oB-UFsm6gldPrDLw730R5-u0ap-4foRfxBUVax-vK0",data,"sheet1!A:C")

}

//***************** Function sendRatio ********************

function sendRatio (data_) {

let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]

postSheet ("1g4ka-xMk_6QHbkUMFxt9HHQEl2wX96YTqp-lwBVHaf0",data,"sheet1!A:C")

}

//***************** Function sendSw4503 ********************

function sendSw4503 (data_) {

let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]

postSheet ("1r6aV9EUBw5imkeLhEmabMEc1BwkLdOfbTt4AHt_daFg",data,"sheet1!A:C")

}

//***************** Function Post Sheet interface ********************

function sendToprank (data_) {

let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]

postSheet ("1aggVBb8hCOclrJMbo4XsbidTgwTBvvr0nqDQwEVh-L4",data,"sheet1!A:C")

}

//***************** Function sendInterface ********************

function sendInterface (data_) {   

  let data = [moment().format("L"), moment().format("LT"),JSON.stringify(data_)]  

    postSheet ("1eZwYLOMnsvuNNr9tg27-BUiQQMxOXsyQ76XeWFmI4xc",data,"sheet1!A:C") 

}







//***************** Function Post ********************

function postSheet (idSheet, data_, column_) {

axios.defaults.headers.post['Content-Type'] = 'application/json';

axios({

method: 'post',

url: 'https://postapi.herokuapp.com/',

data: JSON.stringify({

"KeyID": idSheet,

"column": column_,

"valuesData": data_

})

}).then(function(response) {

if (response.data != 'OK') {

console.log('Error !!',response.statusText)

}else{

console.log(response.statusText)

}

})

}

app.listen(app.get('port'), function () {

console.log('run at port', app.get('port'), 'main.js')

})