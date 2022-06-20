const express  = require('express');
const router = express.Router();
const config = require('./config.js');

const jwt = require('jsonwebtoken');

let memberList = [
	{id:"testid1", password:"testpwd1", name:"홍길동", refreshToken:""},
	{id:"testid2", password:"testpwd2", name:"김철수", refreshToken:""},
	{id:"testid3", password:"testpwd3", name:"이영희", refreshToken:""}];

router.post('/login', async function(req, res, next) {
	console.log("REST API Post Method - Member Login And JWT Sign");
	const memberId = req.body.id;
	const memberPassword = req.body.password;
	var memberItem = memberList.find(object => object.id == memberId);
	if (memberItem != null) {
		if (memberItem.password == memberPassword) {
			let accessToken = "";
			let errorMessageAT = "";
			
			// Access-Token
			try {
				accessToken = await new Promise((resolve, reject) => {
					jwt.sign({
							memberId : memberItem.id,
							memberName : memberItem.name
						},
						config.secret,
						{
							expiresIn : '1m'
						},
						(err, token) => {
							if (err) {
								reject(err);
							} else {
								resolve(token);
							}
						});
				});
			} catch(err) {
				errorMessageAT = err;
			}
			console.log("Access-Token : " + accessToken);
			console.log("Access-Token Error : " + errorMessageAT);
			
			let refreshToken = "";
			let errorMessageRT = "";

			// Refresh-Token
			try {
				refreshToken = await new Promise((resolve, reject) => {
					jwt.sign({
							memberId : memberItem.id
						},
						config.secret,
						{
							expiresIn : '1d'
						},
						(err, token) => {
							if (err) {
								reject(err);
							} else {
								resolve(token);
							}
						});
				});
			} catch(err) {
				errorMessageRT = err;
			}
			console.log("Refresh-Token : " + refreshToken);
			console.log("Refresh-Token Error : " + errorMessageRT);
			
			if (errorMessageAT == "" && errorMessageRT == "") {
				memberItem.refreshToken = refreshToken;
				res.json({success:true, accessToken:accessToken, refreshToken:refreshToken});
			} else {
				res.status(401).json({success:false, errormessage:'token sign fail'});
			}
		} else {
			res.status(401).json({success:false, errormessage:'id and password is not identical'});
		}
	} else {
		res.status(401).json({success:false, errormessage:'id and password is not identical'});
	}
});

router.post('/refresh', async function(req, res, next) {
	console.log("REST API Post Method - Member JWT Refresh");
	const memberId = req.body.id;
	const accessToken = req.body.accessToken;
	const refreshToken = req.body.refreshToken;
	var memberItem = memberList.find(object => object.id == memberId);
	if (memberItem != null) {
		// 아래 코드들이 들어 옵니다. 
	} else {
		res.status(401).json({success:false, errormessage:'id is not identical'});
	}
	let refreshPayload = "";
	let errorMessageRT = "";

	// Refresh-Token Verify
	try {
		refreshPayload = await new Promise((resolve, reject) => {
			jwt.verify(refreshToken, config.secret, 
				(err, decoded) => {
					if (err) {
						reject(err);
					} else {
						resolve(decoded);
					}
				});
		});
	} catch(err) {
		errorMessageRT = err;
	}
	console.log("Refresh-Token Payload : ");
	console.log(refreshPayload);
	console.log("Refresh-Token Verify : " + errorMessageRT);
	let accessPayload = "";
	let errorMessageAT = "";

	// Access-Token Verify
	try {
		accessPayload = await new Promise((resolve, reject) => {
			jwt.verify(accessToken, config.secret, {ignoreExpiration: true}, 
				(err, decoded) => {
					if (err) {
						reject(err);
					} else {
						resolve(decoded);
					}
				});
		});
	} catch(err) {
		errorMessageAT = err;
	}
	console.log("Access-Token Payload : ");
	console.log(accessPayload);
	console.log("Access-Token Verify : " + errorMessageAT);
	if (errorMessageRT == "" && errorMessageAT == "") {
		if (memberId == accessPayload.memberId && memberId == refreshPayload.memberId && memberItem.refreshToken == refreshToken) {
			let accessToken = "";
			errorMessageAT = "";
			
			// Access-Token
			try {
				accessToken = await new Promise((resolve, reject) => {
					jwt.sign({
							memberId : memberItem.id,
							memberName : memberItem.name
						},
						config.secret,
						{
							expiresIn : '1m'
						},
						(err, token) => {
							if (err) {
								reject(err);
							} else {
								resolve(token);
							}
						});
				});
			} catch(err) {
				errorMessageAT = err;
			}
			console.log("Access-Token : " + accessToken);
			console.log("Access-Token Error : " + errorMessageAT);
			
			if (errorMessageAT == "") {
				res.json({success:true, accessToken:accessToken});
			} else {
				res.status(401).json({success:false, errormessage:'token sign fail'});
			}
		} else {
			res.status(401).json({success:false, errormessage:'Token is not identical'});
		}
	} else if (errorMessageRT != "") {
		res.status(401).json({success:false, errormessage:'Refresh-Token has expired or invalid signature'});
	} else if (errorMessageAT != "") {
		res.status(401).json({success:false, errormessage:'Access-Token is invalid signature'});
	}
});

module.exports = router;