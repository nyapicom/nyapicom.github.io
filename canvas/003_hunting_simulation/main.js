/*
drawとactを分離
gameオブジェクトで全てのオブジェクトを管理

外部入力についてどう処理するか？
e.clientY;
*/

let creature = function(x,y,v=1.0){
	this.x=x
	this.y=y
	this.v=v
	this.draw = function(c){
		c.fillStyle = "rgb(255,0,0)"
		c.fillRect(this.x-1.5,this.y-1.5,3,3);
	}
	this.act = function(targets,w,h){
		let dx=0, dy=0, closest_dist=1e9, closest_id=0;
		for (let i = 0; i < targets.length; i++) {
			let dist = Math.pow(targets[i].x - this.x,2) + Math.pow(targets[i].y - this.y,2)
			if(dist<closest_dist){
				closest_dist = dist
				closest_id = i
			}
		}
		dx = targets[closest_id].x - this.x;
		dy = targets[closest_id].y - this.y;
		var d = Math.sqrt(dx*dx+dy*dy);
		if(d==0)d=0.001;
		this.x+=dx/d;
		this.y+=dy/d;
		if(this.x<0)this.x=0;
		if(this.x>w)this.x=w;
		if(this.y<0)this.y=0;
		if(this.y>h)this.y=h;
	}
}

let target = function(x,y,v=1.0){
	this.x=x
	this.y=y
	this.v=v
	this.draw = function(c){
		c.fillStyle = "rgb(0,0,255)"
		c.fillRect(this.x-1.5,this.y-1.5,3,3);
	}
	this.act = function(targets,w,h){
		let dx=0, dy=0, closest_dist=1e9, closest_id=0;
		for (let i = 0; i < targets.length; i++) {
			let dist = Math.pow(targets[i].x - this.x,2) + Math.pow(targets[i].y - this.y,2)
			if(dist<closest_dist){
				closest_dist = dist
				closest_id = i
			}
		}
		dx = targets[closest_id].x - this.x;
		dy = targets[closest_id].y - this.y;
		var d = Math.sqrt(dx*dx+dy*dy);
		if(d==0)d=0.001;
		this.x+=-dx/d;
		this.y+=-dy/d;
		if(this.x<0)this.x=0;
		if(this.x>w)this.x=w;
		if(this.y<0)this.y=0;
		if(this.y>h)this.y=h;
	}
}

// この中でcanvasを生成しても良いかもしれない
let game = function(creatureNumber, targetNumber, canvasContext){
	console.log("gameObject生成")
	this.t = 0
	this.w = 640
	this.h = 480
	this.creatureNum = creatureNumber
	this.targetNum = targetNumber
	this.cr = []
	this.ta = []
	this.c = canvasContext
	this.scene = {}
	var self = this  // ここがミソ（ここでthisを保持しないと、setIntervalのスコープに入ったときに動かなくなる）
	this.act = function(){
		// 目標の情報を与え、行動処理はオブジェクトに丸投げ
		for (let i = 0; i < this.creatureNum; i++) {
			this.cr[i].act(this.ta,this.w,this.h)
		}
		for (let i = 0; i < this.targetNum; i++) {
			this.ta[i].act(this.cr,this.w,this.h)
		}
	}
	this.draw = function(){
		this.c.clearRect(0, 0, this.w, this.h)
		for (let i = 0; i < this.creatureNum; i++) {
			this.cr[i].draw(this.c)
		}
		for (let i = 0; i < this.targetNum; i++) {
			this.ta[i].draw(this.c)
		}
	}
	this.loop = function(){
		// selfはthisが変わりそうなところにだけ入れればOK
		self.act()
		self.draw()
		self.t+=1
	}
	this.init = function(){
		for (let i = 0; i < this.creatureNum; i++) {
			this.cr[i] = new creature(Math.random()*this.w, Math.random()*this.h)
		}
		for (let i = 0; i < this.targetNum; i++) {
			this.ta[i] = new target(Math.random()*this.w, Math.random()*this.h)
		}
		this.scene = setInterval(this.loop, 1000/60)
	}
	this.init()
}

window.onload = function() {
	console.log("loaded")
	var gm = new game(10, 10, document.getElementById("canvas").getContext("2d"))
	console.log(gm)
};