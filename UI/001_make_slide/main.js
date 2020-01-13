/*
UIを作る。
UIに変数へのアクセス権限を与える
*/


let slider = function(val_name){
	console.log("slider生成"+val_name)
	this.val_name = val_name
	this.html = document.createElement('input')
	this.html.setAttribute("type","range")
	document.getElementById('contents').appendChild(this.html)  // 生成したdomはここで追加しないといけない
	this.act = function(val){
		val[this.val_name] = this.html.value  // つまみの値を代入
	}
	this.draw = function(){
	}
}

let text_bar = function(val_name){
	console.log("テキストバー生成"+val_name)
	this.val_name = val_name
	this.html = document.createElement('div')
	document.getElementById('contents').appendChild(this.html)  // 生成したdomはここで追加しないといけない
	this.act = function(){
	}
	this.draw = function(val){
		this.html.innerHTML = ""+val[this.val_name]
	}
}

// この中でcanvasを生成しても良いかもしれない
let master = function(){
	console.log("masterObject生成")
	this.t = 0
	this.val = {a:0, b:0, c:0}
	this.UI = []
	this.scene = {}
	var self = this
	this.act = function(){
		this.UI[0].act(this.val)
		this.UI[1].act(this.val)
		this.UI[2].act(this.val)
	}
	this.draw = function(){
		this.UI[3].draw(this.val)
		this.UI[4].draw(this.val)
		this.UI[5].draw(this.val)
	}
	this.loop = function(){
		self.act()
		self.draw()
		self.t+=1
	}
	this.init = function(){
		// つまみ
		this.UI[0] = new slider("a")
		this.UI[1] = new slider("b")
		this.UI[2] = new slider("c")
		// テキストバー
		this.UI[3] = new text_bar("a")
		this.UI[4] = new text_bar("b")
		this.UI[5] = new text_bar("c")
		// ループ
		this.scene = setInterval(this.loop, 1000/60)
	}
	this.init()
}

window.onload = function() {
	console.log("loaded")
	var ma = new master()
	console.log(ma)
};