/*
boidたちが振動してしまう
更新タイミングを一斉にすると解決するか？
	→関係なかった
*/

// ベクトル
let Vec2 = function(x,y){
	this.x = x
	this.y = y
	this.add = function(v){
		return new Vec2(this.x+v.x,this.y+v.y)
	}
	this.sub = function(v){
		return new Vec2(this.x-v.x,this.y-v.y)
	}
	this.mul = function(a){
		return new Vec2(this.x*v.x,this.y*v.y)
	}
	this.norm = function(){
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
	}
	this.normal = function(){
		let d = this.norm(this)
		return new Vec2(this.x,this.y).mul(1/d)
	}
}


let boid = function(id,x,y,vx,vy){
	this.id = id
	this.pos = new Vec2(x,y)
	this.v = new Vec2(vx,vy)
	this.GetSeparation = function(target, param){  // 周囲から離れる
		let a = new Vec2(0,0)
		for (let i = 0; i < target.length; i++) {
			if(i==this.id)continue
			let da = new Vec2(target[i].pos.x,target[i].pos.y).sub(this.pos)
			if(da.norm>param.separationRadius)continue
			a.add(da).mul(-1)
		}
		return a.normal()
	}
	this.GetAlignment = function(target, param){  // 周囲と向きを揃える
		let a = new Vec2(0,0)
		for (let i = 0; i < target.length; i++) {
			if(i==this.id)continue
			let da = new Vec2(target[i].v.x,target[i].v.y)
			if(da.sub(this.pos).norm>param.mateRadius)continue
			a.add(da)
		}
		return a.normal()
	}
	this.GetCohesion = function(target, param){  // 周囲の重心に集まる
		let a = new Vec2(0,0)
		for (let i = 0; i < target.length; i++) {
			if(i==this.id)continue
			let da = new Vec2(target[i].v.x,target[i].v.y)
			if(da.norm>param.mateRadius)continue
			a.add(da)
		}
		return a.normal()
	}
	this.update = function(target, w, h, dt, param){
		let f = [this.rule1(target,param), this.rule2(target,param), this.rule3(target,param)]
		let a = {x:0,y:0}
		for (let i = 0; i < f.length; i++) {
			a.x += param.coef[i]*f[i].x
			a.y += param.coef[i]*f[i].y
		}
		this.v.x += a.x*dt
		this.v.x += a.y*dt
		let vr = Math.pow(this.v.x,2)+Math.pow(this.v.y,2)
		if(vr>4){  // 速度制限をつけた
			vr = Math.sqrt(vr)
			this.v.x /= vr *= 2
			this.v.y /= vr *= 2
		}
		// 台形近似
		this.x += this.v.x*dt;
		this.y += this.v.y*dt;
		if(this.x>w)this.x-=w
		if(this.x<0)this.x+=w
		if(this.y>h)this.y-=h
		if(this.y<0)this.y+=h
	}
	this.draw = function(c){
		c.fillStyle = "rgb(255,0,0)"
		c.fillRect(this.x-1.5,this.y-1.5,3,3);
	}
}

// この中でcanvasを生成しても良いかもしれない
let master = function(boidNum, canvasContext, dt){
	console.log("gameObject生成")
	this.dt = dt
	this.t = 0
	this.w = 800
	this.h = 480
	this.param = {
		coef:[0.3,0.3,0.3],
		mateRadius:30,
		separationRadius:60
	}
	this.boidNum = boidNum
	this.boid = []
	this.c = canvasContext
	this.scene = {}
	var self = this  // ここがミソ（ここでthisを保持しないと、setIntervalのスコープに入ったときに動かなくなる）
	this.update = function(){
		// 目標の情報を与え、行動処理はオブジェクトに丸投げ
		for (let i = 0; i < this.boidNum; i++) {
			this.boid[i].update(this.boid, this.w, this.h, this.dt/50)
		}
	}
	this.draw = function(){
		this.c.clearRect(0, 0, this.w, this.h)
		for (let i = 0; i < this.boidNum; i++) {
			this.boid[i].draw(this.c)
		}
	}
	this.loop = function(){
		// selfはthisが変わりそうなところにだけ入れればOK
		self.update()
		self.draw()
		self.t += this.dt
	}
	this.init = function(){
		for (let i = 0; i < this.boidNum; i++) {
			this.boid[i] = new boid(i, Math.random()*this.w, Math.random()*this.h, Math.random()*1, Math.random()*1, 60)
		}
		this.scene = setInterval(this.loop, this.dt)
	}
	this.init()
}

window.onload = function() {
	console.log("loaded")
	var gm = new master(300, document.getElementById("canvas").getContext("2d"),1000/60)
	console.log(gm)
};