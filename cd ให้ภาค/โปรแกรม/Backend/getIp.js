var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
var snmp = require('snmp-native')
var moment = require('moment')
var axios = require('axios')
app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 7000))
app.use(bodyParser.urlencoded({extended: false}))
moment.locale('th')
var ip = ["10.77.4.1","10.77.1.2","10.77.7.2","10.77.3.2","10.77.5.2","10.77.8.2","10.77.7.1","10.9.99.1"]
get ()
function get () {
//exports.get = function (){
var device = []
var ratio = []
var sw4503 = {}
var interface =  {
'10.77.4.1': [],
'10.77.1.2': [],
'10.77.7.2': [],
'10.77.3.2': [],
'10.77.5.2': [],
'10.77.8.2': [],
'10.77.7.1': [],
'10.9.99.1': []
}
let i = 0
loop ()
function loop (){
	if(i < 8){
	let standard = {}
	let getData = new snmp.Session({ host: ip[i], community: 'public' })
	//name Interface
	// getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {
	// 	for (let index in varbinds) {
	// 		let indexOf = filterInterface(varbinds[index].oid[10],ip[i-1])

	// 	}
	// })
	//name Interface
	getData.getSubtree({ oid: [1,3,6,1,2,1,4,20,1,2] }, function (err, varbinds) {
		for (let index in varbinds) {
			console.log('index',varbinds[index])
			
		}
	})

	i++
	setTimeout(function(){ loop() },2000)
	}else{
		console.log('get data device.js')
	}
	}//loop
	return [device,ratio,sw4503,interface]
}
function mergeObj (length,in_,out_,name_,tus_){
let allRules = []
for(let c in in_){
allRules.push(Object.assign( name_[c], in_[c], out_[c], tus_[c] ))
}
return allRules
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

app.listen(app.get('port'), function () {
console.log('run at port', app.get('port'),'device.js')
})