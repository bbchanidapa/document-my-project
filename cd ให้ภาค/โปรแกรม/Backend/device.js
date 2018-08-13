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
// get ()
// function get () {
exports.get = function (){
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
var inbound = []
var outbound = []
var inboundToInterface = []
var outboundToInterface = []
var nameInterface = []
var status = []
let arr = {}
let ratios = 0
let ratioList = {}
let standardInterface = {}
//status
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,8] }, function (err, varbinds) {
for (let index in varbinds) {
let indexOf = filterInterface(varbinds[index].oid[10],ip[i-1])
if(indexOf !== null && indexOf !== undefined) {
if(varbinds[index].value == 1){
status.push({ status: 'Up' })
}
else if (varbinds[index].value === 2) {
status.push({ status: 'Down'})
}
else if (varbinds[index].value === 3) {
status.push({ status: 'testing'})
}
else if (varbinds[index].value === 4) {
status.push({ status: 'unknown'})
}
else if (varbinds[index].value === 5) {
status.push({ status: 'dormant'})
}
else if (varbinds[index].value === 6) {
status.push({ status: 'notPresent'})
}
else if (varbinds[index].value === 7) {
status.push({ status: 'lowerLayerDown'})
}
}
}
standardInterface.status = status
})
setTimeout(function(){
//inbound
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {
for (let index in varbinds) {
let indexOf = filterInterface(varbinds[index].oid[10],ip[i-1])
if(indexOf !== null && indexOf !== undefined) {
//console.log(ip[i-1],indexOf,varbinds[index].oid[10])
let traffic = varbinds[index].value
inbound.push( Number(traffic) )
inboundToInterface.push( { in: converType(traffic) } )
nameInterface.push( { interface: indexOf } )
}
}
let sum = inbound.reduce((a, b) => a + b, 0)
//console.log('in',inbound,'sum',sum)
ratios = sum
standard.inbound = converType(sum)
standardInterface.inboundToInterface = inboundToInterface
standardInterface.interface = nameInterface
if(ip[i-1] == '10.77.4.1') sw4503['inbound'] = converType(sum)
})
},1000)
setTimeout(function(){
//outbound
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {
for (let index in varbinds) {
let indexOf = filterInterface(varbinds[index].oid[10],ip[i-1])
if(indexOf !== null && indexOf !== undefined) {
let traffic = varbinds[index].value
outbound.push( Number(traffic) )
outboundToInterface.push({out: converType(traffic)} )
}
}
let sum = outbound.reduce((a, b) => a + b, 0)
ratios += sum
standard.outbound = converType(sum)
standardInterface.outboundToInterface = outboundToInterface
if(ip[i-1] == '10.77.4.1') sw4503['outbound'] = converType(sum)
ratioList[ip[i-1]] = converType(ratios)
ratio.push(ratioList)
arr[ip[i-1]] = standard
let interfaceData = mergeObj( standardInterface.inboundToInterface.length,standardInterface.inboundToInterface,standardInterface.outboundToInterface,standardInterface.interface,standardInterface.status)
interface[ip[i-1]] = interfaceData
device.push(arr)
getData.close()
})
},1000)
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
function converType (bytes){
let unit = 'Gbps'
let unitmod = '1073741824'
bit =  bytes * 8
bit =  bit/unitmod
return (bit.toFixed(2) +' '+unit)
}
app.listen(app.get('port'), function () {
console.log('run at port', app.get('port'),'device.js')
})