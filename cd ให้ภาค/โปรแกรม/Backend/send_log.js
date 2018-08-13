var snmp = require('snmp-native')
var moment = require('moment')
var express = require('express')
var app = express()
var server = require('http').Server(app)
var bodyParser = require('body-parser')
var axios = require('axios')
var cors = require('cors')
var LINEBot = require('line-messaging')
var lineApi = require("line-api")
var token = 'TKjdn3asT6B7bYpghIEKm05I2EqoGgwF33kVRaT3k68 '
var api_key = 'key-de3c04a95a1fbaff3c200907518b3376';
var domain = 'sandbox700d900b0bdb4b5cab876a6af395f94e.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var listMail = ['monitor.sheet1@gmail.com','monitor.sheet2@gmail.com']
var notify = new lineApi.Notify({
token: token
})
notify.status().then(consosle.log)
app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
moment.locale('th')
var cpu = 80
var limitMem = 'GB'
var limitTemp = 55
var ip = ["10.77.4.1","10.77.1.2","10.77.7.2","10.77.3.2","10.77.5.2","10.77.8.2","10.77.7.1","10.9.99.1"]
get ()
setInterval(function(){ get() },1000*60*10)
function get () {
let i = 0
var data = {
cpu: [],
mem: [],
status:[],
temp:[]
}
loop ()
function loop (){
if(i < 8){
let standard = {}
let getData = new snmp.Session({ host: ip[i], community: 'public' })
getData.get({ oid: [1,3,6,1,2,1,1,5,0] }, function (err, varbinds) {
if( ip[i-1] == '10.9.99.1') {
standard.name = 'ISR-4451'
}else{
standard.name = varbinds[0].value
}
})
//CPU
if(ip[i] == '10.77.7.1' ){
getData.get({ oid: [1,3,6,1,4,1,9,9,109,1,1,1,1,5,1000] }, function (err, varbinds) {
if (varbinds[0].value > cpu) {
data.cpu.push( standard.name +':'+ varbinds[0].value + "% " )
}
})
}
else if(ip[i] == '10.9.99.1'){
getData.get({ oid: [1,3,6,1,4,1,9,9,109,1,1,1,1,5,7] }, function (err, varbinds) {
if (varbinds[0].value > cpu) {
data.cpu.push( standard.name +':'+ varbinds[0].value + "% " )
}
})
}
else {
getData.get({ oid: [1,3,6,1,4,1,9,9,109,1,1,1,1,5,1] }, function (err, varbinds) {
if (varbinds[0].value > cpu) {
data.cpu.push( standard.name +':'+ varbinds[0].value + "% " )
}
})
}
//memory
getData.get({ oid: [1,3,6,1,4,1,9,9,48,1,1,1,5,1] }, function (err, varbinds) {
let mem = bytesToSize(varbinds[0].value)
mem = mem.substring(mem.length-2,mem.length)
if (mem == limitMem){
data.mem.push( standard.name +':'+ bytesToSize(varbinds[0].value) + ' ' )
}
})
//temp
getData.getSubtree({ oid: [1,3,6,1,4,1,9,9,13,1,3,1,3] }, function (err, varbinds) {
if(ip[i-1] != '10.9.99.1'){
if (varbinds[0].value  > limitTemp){
data.temp.push( standard.name +':'+ varbinds[0].value + 'C ' )
}
}
})
//status
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,8] }, function (err, varbinds) {
let Interface = []
for (index in varbinds) {
let indexOf = filterInterface(varbinds[index].oid[10],ip[i-1])
if(indexOf !== null && indexOf !== undefined) {
let tus = varbinds[index].value
if (tus == 2) {
Interface.push(indexOf)
}
}
}
if(Interface.length > 0){
data.status.push( '[' +standard.name +':'+ Interface.toString() +']' )
}
getData.close()
})
i++
setTimeout(function(){ loop() },2000)
}//if
else{
let text = ''
let dataToSheet = ''
let day = moment().format("L") +' '+ moment().format("LT")+ ': '
if (data.cpu.length > 0 ){
text += '<b> Show more... </b><br>'
text += '<b>Your CPU was used more then 80% </b><br>'+ data.cpu.toString()
sendNoti(day + ' Your CPU was used more then 80%. Please check!'+  data.cpu.toString())
}
if (data.temp.length > 0 ){
text += '<br><b> Temperature is more than 55 C. </b><br>' + data.temp.toString()
sendNoti(day + " The Temperature is more than 55 C. "+  data.temp.toString())
}
if (data.mem.length > 0 ){
text += '<br><b> Your memory was used more than 1 GB! </b><br>'+ data.mem.toString()
sendNoti(day +' Your memory was used more than 1 GB!'+  data.mem.toString())
}
if (data.status.length > 0 ){
console.log(data.status.toString())
text += "<br><b> In this time, The Port's status was down  </b><br>"+ data.status.toString()
sendNoti(day + " In this time, The Port's status was down."+  data.status.toString())
}
if(text.length != ''){
sendMail(text)
}
for(let c in data){
if(data[c].length == 0){
delete data[c]
}
}
sendSheet(data)
}
}//loop
}//******************************function*******************************
function sendNoti (text){
notify.send({
message: text
}).then(console.log)
}
function sendMail (text){
for (let index in listMail) {
let email = listMail[index]
var mailcomposer = require('mailcomposer')
var mail = mailcomposer({
from: 'FITM Monitoring <postmaster@sandbox700d900b0bdb4b5cab876a6af395f94e.mailgun.org>',
  to: listMail[index],
  subject: 'Network problem',
  html: text
  })
  mail.build(function(mailBuildError, message) {
  var dataToSend = {
  to: listMail[index],
  message: message.toString('ascii')
  }
  mailgun.messages().sendMime(dataToSend, function (sendError, body) {
  if (sendError) {
  console.log(sendError);
  return
  }
  })
  })
  }
  }
  function sendSheet (json) {
  moment.locale('th')
  let txt = [moment().format("L"), moment().format("LT"),JSON.stringify(json)]
  postSheet ("18I5Vg4u-ddK8CHAX2KQQxnxQVNJoiL_UAZdSfh87ANE",txt)
  }
  //***************** Function Post ********************
  function postSheet (idSheet,datas) {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios({
  method: 'post',
  url: 'https://apisheet.herokuapp.com/',
  data: JSON.stringify({
  "KeyID": idSheet,
  "column": "sheet1!A:C",
  "valuesData": datas
  })
  }).then(function(response) {
  if (response.statusText != 'OK') {
  console.log(response.statusText)
  }else{
  console.log('run at port', app.get('port'),'event log')
  console.log(response.statusText)
  }
  })
  }
  function filterInterface (index_,ip_) {
  if(ip_ == '10.9.99.1'){
  if(index_ == 1) {
  return 'Gi0/0/2'
  }
  else if(index_ == 3) {
  return 'Gi0/0/0'
  }
  else{
  return null
  }
  }
  else if(ip_ == '10.77.7.1'){
  if(index_ == 3) {
  return 'Gi1/0/1'
  }
  else if(index_ == 4) {
  return 'Gi1/0/2'
  }
  else if(index_ == 35) {
  return 'Vlan304'
  }
  else{
  return null
  }
  }
  else if(ip_ == '10.77.4.1'){
  if(index_ == 9) {
  return 'Gi2/1'
  }
  else if(index_ == 10) {
  return 'Gi2/2'
  }
  else if(index_ == 11) {
  return 'Gi2/3'
  }
  else if(index_ == 14) {
  return 'Gi2/6'
  }
  else if(index_ == 81) {
  return 'Vlan304'
  }
  else{
  return null
  }
  }
  if(ip_ == '10.77.7.2'){
  if(index_ == 10149) {
  return 'Gi0/49'
  }
  else if(index_ == 10148) {
  return 'Gi0/48'
  }
  else{
  return null
  }
  }
  if(ip_ == '10.77.1.2'){
  if(index_ == 10103) {
  return 'Gi0/3'
  }
  else if(index_ == 10149) {
  return 'Gi0/49'
  }
  else if(index_ == 10151) {
  return 'Gi0/51'
  }
  else{
  return null
  }
  }
  if(ip_ == '10.77.5.2'){
  if(index_ == 10149) {
  return 'Gi0/49'
  }
  else if(index_ == 10150) {
  return 'Gi0/50'
  }
  else if(index_ == 10151) {
  return 'Gi0/51'
  }
  else if(index_ == 10152) {
  return 'Gi0/52'
  }
  else{
  return null
  }
  }
  if(ip_ == '10.77.3.2'){
  if(index_ == 10149) {
  return 'Gi0/49'
  }
  else if(index_ == 10151) {
  return 'Gi0/51'
  }
  else{
  return null
  }
  }
  if(ip_ == '10.77.8.2'){
  if(index_ == 10149) {
  return 'Gi0/49'
  }
  else if(index_ == 10151) {
  return 'Gi0/51'
  }
  else{
  return null
  }
  }
  }
  function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i] +' '
  }
  app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'),'event log')
  })