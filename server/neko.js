//连接数据库
var db_mysql = require('mysql');
var NEKO_DATABASE = 'nekodb';
var db_client = db_mysql.createClient({
	user: 'root',
	password: 'bandeng',
});
db_client.query('USE '+NEKO_DATABASE);
exports.askRoom = function(){
	//数据
	var m_Connections = [];//连接管理
	var m_Clients = [];//用户管理
	var m_Rooms = [];//房间管理
	var m_TempConnections = [];//临时连接
	var m_TempConCount = 0;
	var n_Clients = 0;
	var self = this;
	var io;//socket.io
	var m_Config = {
		"ListenPort" : 8080,
		"MaxClientNum" : 1000,
	};
	//设置
	this.SetConfig = function(cfg){
		for(var x in cfg){
			m_Config[x] = cfg[x];
		}
	}	
	//启动
	this.Startup = function(){		
		//网络服务
		io = require('socket.io').listen(m_Config.ListenPort);
		io.sockets.on('connection', function (socket){
			socket.on("disconnect", OnClose);
			socket.on("login", OnLogin);
			socket.on("joinRoom", OnJoinRoom);
			socket.on("leaveRoom", OnLeaveRoom);
			socket.on("message", OnMessage);
			socket.on("reply",OnReply);
			socket.on("ask",OnAsk);
			socket.on("location",OnLocation);
		});
		console.log('server is started, port: ' + m_Config.ListenPort);
	}
	//获取用户列表
	var GetUserList = function(){
		var list = [];
		for(var sid in m_Connections){
			var info = GetUserInfo(sid);
			if(info != null)
				list.push(info);
		}
		return list;
	}
	//获取用户信息
	var GetUserInfo = function(sid){
		if(!m_Connections[sid]) return;
		return {
			//"id" : m_Connections[sid].socket.id,
			"userid" : m_Connections[sid].userid,
			"location" : m_Connections[sid].location,
			"x" : m_Connections[sid].x,
			"y" : m_Connections[sid].y,
			"name" : m_Connections[sid].name,
		}
	}
	var LoginSupport = function(err,results,tempid){
		try{
			if (err) {
				m_TempConnections[tempid][0].disconnect();
				m_TempConnections[tempid] = null;
				return;  
			}
			var Session = ''+results[0].Token+'';
			var socket = m_TempConnections[tempid][0];
			var data = m_TempConnections[tempid][1];
			if(n_Clients < m_Config.MaxClientNum){
				if(Session != data.time){
					throw "Error";
				}
				var client = {
					socket   : socket,
					userid   : data.id,
					name	 : data.name,
					location : -1,
					x : -1,
					y : -1,
					token : data.time,
				};
				//reload?
				if(m_Clients[data.id]!=null){
					var temp = m_Connections[m_Clients[data.id]];
					client.location = temp.location;
					client.x = temp.x;
					client.y = temp.y;
					m_Connections[m_Clients[data.id]] = null;
				}
				else{
					n_Clients++;
				}
				//更新客户端链接
				m_Connections[socket.id] = client;			
				m_Clients[data.id] = socket.id;
				//登陆成功
				socket.emit("login", {
					"ret"  : 1,
					"list" : GetUserList(),
				});
				//发送用户加入大厅
				io.sockets.emit("join", GetUserInfo(socket.id));
			}else{
				//登陆失败
				socket.emit("login", {"ret" : 0});
				throw "Error";
			}
		}
		catch(e){
			console.log(e);
			try{
				m_TempConnections[tempid][0].disconnect();
				m_TempConnections[tempid] = null;
			}
			catch(e){

			}
		}	
	}
	//用户登陆
	var OnLogin = function(data){
		try{
			var temp = parseInt(data.id);
			if(isNaN(temp)){
				throw "Error";
			}
		}
		catch(e){
			this.disconnect();
			console.log(e);
			return;
		}
		m_TempConnections[m_TempConCount] = [this,data];
		var functionstr = "function a(){return function(e,r,f){LoginSupport(e,r,"+m_TempConCount+");};};a();";
		var newFunc = eval(functionstr);
		db_client.query
		( 
			'SELECT Token,id FROM nekonekotrace_userinfo where id =' + data.id,
			newFunc
		);
		m_TempConCount++;
		if(m_TempConCount >= m_Config.MaxClientNum){
			m_TempConCount = 0;
		}
	}
	//关闭链接
	var OnClose = function(data){
		return;
		//need auto logout insteadof this-xhl
		var sid = this.id;
		if(!m_Connections[sid]) 
			return;
		n_Clients--;	
		//发送退出消息
		io.sockets.emit("close", {
			"id" : sid,
			"roomIdx" : m_Connections[sid].roomIdx,
		});		
		var roomIdx = m_Connections[sid].roomIdx;
		if(roomIdx != -1){
			io.sockets.emit("leaveRoom", {
				"id" 	   : sid,
				"roomIdx"  : roomIdx,
			});
			m_Rooms[roomIdx][posIdx] = 0;
			m_Rooms[roomIdx].splice(posIdx,1);
		}
		//删除元素
		delete m_Connections[sid];	
	}
	//加入房间
	var OnJoinRoom = function(data){
		try{
			var sid = this.id;
			if(data.roomIdx > -1  && m_Connections[sid]){
				if(typeof(m_Rooms[data.roomIdx]) == 'undefined'){
					m_Rooms[data.roomIdx] = [];
				}

				if(m_Rooms[data.roomIdx][sid]!=null){
					return;
				}
				m_Rooms[data.roomIdx][sid] = sid;			
				//发送房间内信息
				var info = [];
				for(var j in m_Rooms[data.roomIdx]){
					if(j!=null){
						var temp = GetUserInfo(m_Connections[j]);
						info.push(temp);
					}
				}
				this.emit("joinRoom", {ret:1,list:info});
			}
		}
		catch(e){
			console.log(e);
		}
	}
	//离开房间
	var OnLeaveRoom = function(data){
		try{
			var sid = this.id;
			if(data.roomIdx > -1  && m_Connections[sid]){			
				//先通知房间有人离开
				for(var j in m_Rooms[data.roomIdx]){
					if(j!=null){
						try{
							m_Connections[j].socket.emit('leaveRoom',{id:m_Connections[sid].userid,roomIdx:data.roomIdx});
						}
						catch(e){

						}
					}
				}
				m_Rooms[data.roomIdx][sid] = null;
			}
		}
		catch(e){
			console.log(e);
		}
	}  
	//发送消息
	var OnMessage = function (data){
		try{
			var sid = this.id;
			if(!m_Connections[sid]) return;
			var cli = m_Connections[sid];
			if(data.to && data.id){
				var msg_to = {
					userid : cli.userid,
					id : data.id,
					json : data.json
				};
				m_Connections[m_Clients[data.to]].socket.emit("message", msg_to);
			}
			console.log(data.to+" should receive "+data.id);
		}
		catch(e){
			console.log(e);
		}
	}
	//提问的回复
	var OnReply = function(data){
		try{
			var sid = this.id;
			if(!m_Connections[sid]) return;
			var cli = m_Connections[sid];
			if(data.roomIdx && data.id){
				var msg_to = {
					userid : cli.userid,
					id : data.id,
					roomIdx : data.roomIdx,
					json : data.json
				};
				for(var j in m_Rooms[data.roomIdx]){
					if(j!=null){
						try{
							m_Connections[j].socket.emit('reply',msg_to);
						}
						catch(e){

						}
					}
				}
			}
			console.log(data.roomIdx+" members should receive "+data.id);
		}
		catch(e){
			console.log(e);
		}
	}
	//提问
	var OnAsk = function(data){
		try{
			var sid = this.id;
			if(!m_Connections[sid]) return;
			var cli = m_Connections[sid];
			if(data.id){
				var msg_to = {
					userid : cli.userid,
					id : data.id,
					json : data.json
				};
				io.sockets.emit("ask", msg_to);
			}
			console.log("all should receive "+data.id);
		}
		catch(e){
			console.log(e);
		}
	}
	//更新地点
	var OnLocation = function(data){
		try{
			var sid = this.id;
			if(!m_Connections[sid]) return;
			var cli = m_Connections[sid];
			cli.location = data.id;
			cli.x = data.x;
			cli.y = data.y;
			if(data.id){
				var msg_to = {
					userid : cli.userid,
					id : data.id,
					x : data.x,
					y : data.y,
					name : data.name,
					locname : data.locname,
				};
				io.sockets.emit("location", msg_to);
			}
			console.log("all should know "+cli.userid);
		}
		catch(e){
			console.log(e);
		}
	}
}