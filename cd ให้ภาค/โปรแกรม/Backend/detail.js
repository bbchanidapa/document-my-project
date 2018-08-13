var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
var snmp = require('snmp-native')
var moment = require('moment')
var axios = require('axios')
app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 8000))
app.use(bodyParser.urlencoded({extended: false}))
moment.locale('th')
var ip = ["10.77.4.1","10.77.1.2","10.77.7.2","10.77.3.2","10.77.5.2","10.77.8.2","10.77.7.1","10.9.99.1"]
/*get ()
function get () {*/
exports.get = function (){
var data = []
let count = 0
loop ()
function loop (){
if(count < 8){
let standard = {}
let getData = new snmp.Session({ host: ip[count], community: 'public' })
//ips
standard.ip = ip[count]
//name
getData.get({ oid: [1,3,6,1,2,1,1,5,0] }, function (err, varbinds) {
if( ip[count-1] == '10.9.99.1') {
standard.name = 'ISR-4451'
}else{
standard.name = varbinds[0].value
}
})
//Os
getData.get({ oid: [1,3,6,1,2,1,1,1,0] }, function (err, varbinds) {
standard.ios = varbinds[0].value
})
//Uptime
getData.get({ oid: [1,3,6,1,2,1,1,3,0] }, function (err, varbinds) {
let timetick = varbinds[0].value
let min = parseInt(timetick / 6000)
let hour = parseInt(timetick / 360000)
standard.uptime = Math.floor( (hour* 0.041667) + (min * 0.00069444) )
})
//CPU
if(ip[count] == '10.77.7.1' ){
getData.get({ oid: [1,3,6,1,4,1,9,9,109,1,1,1,1,5,1000] }, function (err, varbinds) {
standard.cpu = varbinds[0].value
})
}
else if(ip[count] == '10.9.99.1'){
getData.get({ oid: [1,3,6,1,4,1,9,9,109,1,1,1,1,5,7] }, function (err, varbinds) {
standard.cpu = varbinds[0].value
})
}
else {
getData.get({ oid: [1,3,6,1,4,1,9,9,109,1,1,1,1,5,1] }, function (err, varbinds) {
standard.cpu = varbinds[0].value
})
}
//memory
getData.get({ oid: [1,3,6,1,4,1,9,9,48,1,1,1,5,1] }, function (err, varbinds) {
let mem = bytesToSize(varbinds[0].value)
standard.mem = mem
})
//temp
getData.getSubtree({ oid: [1,3,6,1,4,1,9,9,13,1,3,1,3] }, function (err, varbinds) {
if (ip[count-1] != '10.9.99.1'){
standard.temp = varbinds[0].value
}
else {
standard.temp = 'null'
}
data.push(standard)
getData.close()
})
count++
setTimeout(function(){ loop() },1000)
}else{
console.log('get data detail.js')
}
}//fun loop
return data
}
function bytesToSize(bytes) {
var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
if (bytes == 0) return '0 Byte'
let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
app.listen(app.get('port'), function () {
console.log('run at port', app.get('port'),'detail.js')
})