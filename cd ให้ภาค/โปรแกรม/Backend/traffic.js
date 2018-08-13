var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
var snmp = require('snmp-native')
var moment = require('moment')
var axios = require('axios')
app.use(cors())
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
moment.locale('th')
var ip = ["10.77.4.1","10.77.1.2","10.77.7.2","10.77.3.2","10.77.5.2","10.77.8.2","10.77.7.1","10.9.99.1"]
// get ()
// function get () {
	exports.get = function (){
		var data = []
		let i = 0
		loop ()
		function loop (){
			if(i < 8){
				let standard = {}
				let getData = new snmp.Session({ host: ip[i], community: 'public' })
//inbound
var inbound = []
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,10] }, function (err, varbinds) {
	for (let index in varbinds) {
		let traffic = varbinds[index].value
		let item = {
			indexOID: varbinds[index].oid[10],
			inbound: converType(traffic)
		}
		inbound.push(item)
	}
	standard.inbound = inbound
})
//outbound
var outbound = []
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,16] }, function (err, varbinds) {
	for (let index in varbinds) {
		let traffic = varbinds[index].value
		let item = {
			indexOID: varbinds[index].oid[10],
			outbound: converType(traffic)
		}
		outbound.push(item)
	}
	standard.outbound = outbound
})
//status
var status = []
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,8] }, function (err, varbinds) {
	for (let index in varbinds) {
		if(varbinds[index].value == 1){
			status.push('Up')
		}
		else if (varbinds[index].value === 2) {
			status.push('Down')
		}
		else if (varbinds[index].value === 3) {
			status.push('testing')
		}
		else if (varbinds[index].value === 4) {
			status.push('unknown')
		}
		else if (varbinds[index].value === 5) {
			status.push('dormant')
		}
		else if (varbinds[index].value === 6) {
			status.push('notPresent')
		}
		else if (varbinds[index].value === 7) {
			status.push('lowerLayerDown')
		}
	}
})
//name interface
var interface = []
let inbounds = []
let outbounds = []
standard.total = []
getData.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,2] }, function (err, varbinds) {
	for (let index in varbinds) {
		interface.push(varbinds[index].value)
	}
	standard.interface = []
	for (let index in interface) {
		let item = {
			interface: interface[index],
			status: status[index],
			indexOID: varbinds[index].oid[10]
		}
		standard.interface.push(item)
	}
	for (let c in standard.interface) {
		for (let x in standard.inbound) {
			if (standard.interface[c].indexOID === standard.inbound[x].indexOID) {
				let item = {
					interface: standard.interface[c].interface,
					status: standard.interface[c].status,
					inbound: standard.inbound[x].inbound,
					outbound: standard.outbound[x].outbound
				}
				standard.total.push(item)
}//if
}
}
let item = {
	ip: ip[i-1],
	detail: standard.total
}
data.push(item)
getData.close()
})
i++
setTimeout(function(){ loop() },2200)
}else{
	console.log('get data device ')
}
}//loop
return data
}
function converType (bit){
	bytes = bit * 8
	let unit = ''
	let unitmod = ''
	if(bytes  > 1073741824)
	{
		unit = "Gbps";
		unitmod = 1073741824;
	}
	else if(bytes  > 1048576)
	{
		unit = "Mbps";
		unitmod = 1048576;
	}
	else if(bytes  > 1024)
	{
		unit = "Kbps";
		unitmod = 1024;
	}
	else
	{
		unit = "bps";
		unitmod = 1;
	}
	bytes =  bytes/unitmod
	return bytes.toFixed(2) +' '+ unit
}
app.listen(app.get('port'), function () {
	console.log('run at port', app.get('port'),'traffic.js')
})