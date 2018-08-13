var express = require('express')

var bodyParser = require('body-parser')

var app = express()

var cors = require('cors')

var snmp = require('snmp-native')

var moment = require('moment')

var axios = require('axios')

app.use(cors())

app.use(bodyParser.json())

app.set('port', (process.env.PORT || 6000))

app.use(bodyParser.urlencoded({extended: false}))

moment.locale('th')

var trafficTopRank = []

exports.get = function (){

trafficTopRank = []

getSw4503()

setTimeout(function(){ getR124()   },1000)

setTimeout(function(){ getR101C()  },2000)

setTimeout(function(){ getR330A()  },3000)

setTimeout(function(){ getR415()   },4000)

setTimeout(function(){ getRshop()  },5000)

return trafficTopRank

}

function getSw4503 () {

let standard = {}

let sw4503 = new snmp.Session({ host: '10.77.4.1', community: 'public' })

//inbound

var inbound = []

sw4503.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

inbound: convert(varbinds[index].value)

}

inbound.push(data)

}

standard.inbound = inbound

})

//outbound

var outbound = []

sw4503.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

outbound: convert(varbinds[index].value)

}

outbound.push(data)

}

standard.outbound = outbound

})

//name interface

var interface = []

let inbounds = []

let outbounds = []

sw4503.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {

for (index in varbinds) {

interface.push(varbinds[index].value)

}

standard.interface = []

for (index in interface) {

let data = {

interface: interface[index],

indexOID: varbinds[index].oid[10]

}

standard.interface.push(data)

}

for (i in standard.interface) {

for (x in standard.inbound) {

if (standard.interface[i].indexOID === standard.inbound[x].indexOID) {

//************************Top Rank****************************

let vlanName =  standard.interface[i].interface

if (vlanName == 'Vlan43') {

outbounds.push( {'10.4.101.0 0/24 #Vlan43' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.101.0 0/24 #Vlan43' : standard.inbound[x].inbound } )

}

else if (vlanName== 'Vlan44') {

outbounds.push( {'10.4.201.0 0/24 #Vlan44' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.201.0 0/24 #Vlan44' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan45') {

outbounds.push( {'10.4.2.0 0/24 #Vlan45' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.2.0 0/24 #Vlan45' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan46') {

outbounds.push( {'10.14.94.0 0/24 #Vlan46' : standard.outbound[x].outbound } )

inbounds.push( {'10.14.94.0 0/24 #Vlan46' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan47') {

outbounds.push( {'10.4.160.0 0/24 #Vlan47' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.160.0 0/24 #Vlan47' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan99') {

outbounds.push( {'10.4.99.0 0/24 #Vlan99' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.99.0 0/24 #Vlan99' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan304') {

outbounds.push( {'10.77.4.0 0/24 #Vlan304' : standard.outbound[x].outbound } )

inbounds.push( {'10.77.4.0 0/24 #Vlan304' : standard.inbound[x].inbound } )

}

//************************Top Rank****************************

}//if

}

}

to_topRanking({ip:"10.77.4.1",inbound:inbounds, outbound:outbounds})//Send to function POST Sheet Top Rank

sw4503.close()

})

}//******************************function*******************************

function getR124 () {

let standard = {}

let r124 = new snmp.Session({ host: '10.77.1.2', community: 'public' })

//inbound

var inbound = []

r124.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

inbound: convert(varbinds[index].value)

}

inbound.push(data)

}

standard.inbound = inbound

})

//outbound

var outbound = []

r124.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

outbound: convert(varbinds[index].value)

}

outbound.push(data)

}

standard.outbound = outbound

})

//name interface

var interface = []

r124.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {

for (index in varbinds) {

interface.push(varbinds[index].value)

}

standard.interface = []

for (index in interface) {

let data = {

interface: interface[index],

indexOID: varbinds[index].oid[10]

}

standard.interface.push(data)

}

//************************standard.total****************************

standard.total = []

let inbounds = []

let outbounds = []

for (i in standard.interface) {

for (x in standard.inbound) {

if (standard.interface[i].indexOID === standard.inbound[x].indexOID) {

//************************Top Rank****************************

let vlanName =  standard.interface[i].interface



if (vlanName == 'Vlan11') {

outbounds.push( {'10.1.201.0 0/24 #Vlan11' : standard.outbound[x].outbound } )

inbounds.push( {'10.1.201.0 0/24 #Vlan11' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan14') {

inbounds.push( {'10.1.224.0 0/24 #Vlan14' : standard.inbound[x].inbound } )

outbounds.push( {'10.1.224.0 0/24 #Vlan14' : standard.outbound[x].outbound } )

}

else if (vlanName == 'Vlan15') {

inbounds.push( {'10.1.160.0 0/22 #Vlan15' : standard.inbound[x].inbound } )

outbounds.push( {'10.1.160.0 0/22 #Vlan15' : standard.outbound[x].outbound } )

}

//************************Top Rank****************************

}//if



}//for

}

to_topRanking({ip:"10.77.1.2",inbound:inbounds, outbound:outbounds})//Send to function POST Sheet Top Rank

r124.close()

})

}//******************************function*******************************

function getR330A () {

let standard = {}

let r330a = new snmp.Session({ host: '10.77.3.2', community: 'public' })

//inbound

var inbound = []

r330a.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

inbound: convert(varbinds[index].value)

}

inbound.push(data)

}

standard.inbound = inbound

})

//outbound

var outbound = []

r330a.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

outbound: convert(varbinds[index].value)

}

outbound.push(data)

}

standard.outbound = outbound

})

//name interface

var interface = []

let inbounds = []

let outbounds = []

r330a.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {

for (index in varbinds) {

interface.push(varbinds[index].value)

}

standard.interface = []

for (index in interface) {

let data = {

interface: interface[index],

indexOID: varbinds[index].oid[10]

}

standard.interface.push(data)

}

standard.total = []

for (i in standard.interface) {

for (x in standard.inbound) {

if (standard.interface[i].indexOID === standard.inbound[x].indexOID) {

//************************Top Rank****************************

let vlanName =  standard.interface[i].interface

if (vlanName == 'Vlan31') {

outbounds.push( {'10.3.24.0 0/24 #Vlan31' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.24.0 0/24 #Vlan31' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan32') {

outbounds.push( {'10.3.25.0 0/24 #Vlan32' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.25.0 0/24 #Vlan32' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan33') {

outbounds.push( {'10.3.27.0 0/24 #Vlan33' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.27.0 0/24 #Vlan33' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan34') {

outbounds.push( {'10.3.230.0 0/24 #Vlan34' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.230.0 0/24 #Vlan34' : standard.inbound[x].inbound } )

}

else if (vlanName== 'Vlan35') {

outbounds.push( {'10.3.32.0 0/24 #Vlan35' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.32.0 0/24 #Vlan35' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan36') {

outbounds.push( {'10.3.91.0 0/24 #Vlan36' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.91.0 0/24 #Vlan36' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan37') {

outbounds.push( {'10.3.92.0 0/24 #Vlan37' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.92.0 0/24 #Vlan37' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan38') {

outbounds.push( {'10.3.160.0 0/24 #Vlan38' : standard.outbound[x].outbound } )

inbounds.push( {'10.3.160.0 0/24 #Vlan38' : standard.inbound[x].inbound } )

}

//************************Top Rank****************************

}//if

}

}

to_topRanking({ip:"10.77.3.2",inbound:inbounds, outbound:outbounds})//Send to function POST Sheet Top Rank

r330a.close()

})

}//******************************function*******************************

function getR101C () {

let standard = {}

let r101c = new snmp.Session({ host: '10.77.7.2', community: 'public' })

//inbound

var inbound = []

r101c.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

inbound: convert(varbinds[index].value)

}

inbound.push(data)

}

standard.inbound = inbound

})

//outbound

var outbound = []

r101c.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

outbound: convert(varbinds[index].value)

}

outbound.push(data)

}

standard.outbound = outbound

})

//name interface

var interface = []

let inbounds = []

let outbounds = []

r101c.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {

for (index in varbinds) {

interface.push(varbinds[index].value)

}

standard.interface = []

for (index in interface) {

let data = {

interface: interface[index],

indexOID: varbinds[index].oid[10]

}

standard.interface.push(data)

}

standard.total = []

for (i in standard.interface) {

for (x in standard.inbound) {

if (standard.interface[i].indexOID === standard.inbound[x].indexOID) {

//************************Top Rank****************************

let vlanName =  standard.interface[i].interface

if (vlanName == 'Vlan121') {

outbounds.push( {'10.1.101.0 0/24 #Vlan121' : standard.outbound[x].outbound } )

inbounds.push( {'10.1.101.0 0/24 #Vlan121' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan122') {

outbounds.push( {'10.12.160.0 0/24 #Vlan122' : standard.outbound[x].outbound } )

inbounds.push( {'10.12.160.0 0/24 #Vlan122' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan312') {

outbounds.push( {'10.77.12.0 0/24 #Vlan312' : standard.outbound[x].outbound } )

inbounds.push( {'10.77.12.0 0/24 #Vlan312' : standard.inbound[x].inbound } )

}

//************************Top Rank****************************

}//if

}

}

to_topRanking({ip:"10.77.7.2",inbound:inbounds, outbound:outbounds})//Send to function POST Sheet Top Rank

r101c.close()

})

}//******************************function*******************************

function getR415 () {

let standard = {}

let r415 = new snmp.Session({ host: '10.77.5.2', community: 'public' })

//inbound

var inbound = []

r415.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

inbound: convert(varbinds[index].value)

}

inbound.push(data)

}

standard.inbound = inbound

})

//outbound

var outbound = []

r415.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

outbound: convert(varbinds[index].value)

}

outbound.push(data)

}

standard.outbound = outbound

})

//name interface

var interface = []

let inbounds = []

let outbounds = []

r415.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {

for (index in varbinds) {

interface.push(varbinds[index].value)

}

standard.interface = []



for (index in interface) {

let data = {

interface: interface[index],

indexOID: varbinds[index].oid[10]

}

standard.interface.push(data)

}

for (i in standard.interface) {

for (x in standard.inbound) {

if (standard.interface[i].indexOID === standard.inbound[x].indexOID) {

//************************Top Rank****************************

let vlanName =  standard.interface[i].interface

if (vlanName== 'Vlan51') {

outbounds.push( {'10.4.8.0 0/24 #Vlan51' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.8.0 0/24 #Vlan51' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan52') {

outbounds.push( {'10.4.8.0 0/22 #Vlan52' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.8.0 0/22 #Vlan52' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan53') {

outbounds.push( {'10.4.11.0 0/24 #Vlan53' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.11.0 0/24 #Vlan53' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan54') {

outbounds.push( {'10.4.15.0 0/24 #Vlan54' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.15.0 0/24 #Vlan54' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan55') {

outbounds.push( {'10.4.16.0 0/24 #Vlan55' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.16.0 0/24 #Vlan55' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan56') {

outbounds.push( {'10.4.17.0 0/24 #Vlan56' : standard.outbound[x].outbound } )

inbounds.push( {'10.4.17.0 0/24 #Vlan56' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan57') {

outbounds.push( {'10.41.92.0 0/24 #Vlan57' : standard.outbound[x].outbound } )

inbounds.push( {'10.41.92.0 0/24 #Vlan57' : standard.inbound[x].inbound } )

}

else if (vlanName == 'Vlan58') {

outbounds.push( {'10.41.160.0 0/24 #Vlan58' : standard.outbound[x].outbound } )

inbounds.push( {'10.41.160.0 0/24 #Vlan58' : standard.inbound[x].inbound } )

}

//************************Top Rank****************************

}//if

}

}

to_topRanking({ip:"10.77.5.2",inbound:inbounds, outbound:outbounds})//Send to function POST Sheet Top Rank

r415.close()

})

}//******************************function*******************************

function getRshop () {

let standard = {}

let rshop = new snmp.Session({ host: '10.77.8.2', community: 'public' })

//inbound

var inbound = []

rshop.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

inbound: convert(varbinds[index].value)

}

inbound.push(data)

}

standard.inbound = inbound

})

//outbound

var outbound = []

rshop.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {

for (index in varbinds) {

let data = {

indexOID: varbinds[index].oid[10],

outbound: convert(varbinds[index].value)

}

outbound.push(data)

}

standard.outbound = outbound

})

//name interface

var interface = []

let inbounds = []

let outbounds = []

rshop.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {

for (index in varbinds) {

interface.push(varbinds[index].value)

}

standard.interface = []

for (index in interface) {

let data = {

interface: interface[index],

indexOID: varbinds[index].oid[10]

}

standard.interface.push(data)

}

standard.total = []

for (i in standard.interface) {

for (x in standard.inbound) {

if (standard.interface[i].indexOID === standard.inbound[x].indexOID) {

//************************Top Rank****************************

let traffice = standard.inbound[x].inbound + standard.outbound[x].outbound

let vlanName =  standard.interface[i].interface

if (vlanName == 'Vlan88') {

outbounds.push( {'10.88.160.0 0/22 #Vlan88' : standard.outbound[x].outbound } )

inbounds.push( {'10.88.160.0 0/22 #Vlan88' : standard.inbound[x].inbound } )

}

//************************Top Rank****************************

}//if

}

}

to_topRanking({ip:"10.77.8.2",inbound:inbounds, outbound:outbounds})//Send to function POST Sheet Top Rank

rshop.close()

})

}//******************************function*******************************

function to_topRanking (data_) {

let count = trafficTopRank.length

if (count == 5) {

trafficTopRank.push(data_)

console.log('get data top rank')

}else {

trafficTopRank.push(data_)

}

}

function bytesToSize(bytes) {

  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  if (bytes == 0) return '0 Byte'

    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]

}

function convert (bit) {

  let unit = ''

  let unitmod = ''

  bytes = bit * 8



  if(bytes  > 1024)

  {

    unit = "Kbps";

    unitmod = 1024;

  }

  else

  {

    unit = "bps"

    unitmod = 1

  }

  bytes =  bytes/unitmod

  return bytes.toFixed(2)

}

app.listen(app.get('port'), function () {

console.log('run at port', app.get('port'),'toprank.js')

})