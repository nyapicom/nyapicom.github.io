function HSVtoRGB(a,b,c){for(var d,e,f;0>a;)a+=360;a%=360;if(0==b)return ""+Math.round(c)+","+Math.round(c)+","+Math.round(c);b/=255;var h=Math.floor(a/60)%6,k=a/60-h;a=c*(1-b);var g=c*(1-k*b);b=c*(1-(1-k)*b);switch(h){case 0:d=c;e=b;f=a;break;case 1:d=g;e=c;f=a;break;case 2:d=a;e=c;f=b;break;case 3:d=a;e=g;f=c;break;case 4:d=b;e=a;f=c;break;case 5:d=c,e=a,f=g;}var i=""+Math.round(d)+","+Math.round(e)+","+Math.round(f);return i;}

//フォーム関連
function setupDes() {
    var input = document.getElementsByTagName("input");
    for (i = 0; i < input.length; i++) {
        if ((input[i].className.search("nodes") < 0) && ((input[i].getAttribute("type") == "text")||(input[i].getAttribute("type") == null))) {
            if (input[i].value == input[i].defaultValue) {input[i].className += " ondes"; }
            input[i].onfocus = function() {offDes(this); }
            input[i].onblur = function() {onDes(this); }
        }
    }
    return;
}
function offDes(from) {
    if (from.className.search("ondes") < 0) {return 0;}
    from.className = from.className.replace(/ondes/, "");
    from.value = "";
    return 1;
}
function onDes(from) {
    if (from.value != "") {return 0;}
    from.className += " ondes";
    from.value = from.defaultValue;
    return 1;
}
function submit_comment(code){
	if(13 === code)//エンターが押されたなら
	{
		var text = $("#chat_show").html();
		text+="["+my.id+"]"+$("#chat_text").val()+"<br>";
		$("#chat_show").html(text);	
	}
}

//キー入力関連
var KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40, W:87, A:65, S:83, D:68, Z:90 };
var key_state = {
	right: false,
	up: false,
	left: false,
	down: false,
	z: false,
};
function keyDown(e) {
	switch(e.keyCode) {
		case KEY.RIGHT: key_state.right = true; break;
		case KEY.D:     key_state.right = true; break;
		case KEY.UP:    key_state.up    = true; break;
		case KEY.W:     key_state.up    = true; break;
		case KEY.LEFT:  key_state.left  = true; break;
		case KEY.A:     key_state.left  = true; break;
		case KEY.DOWN:  key_state.down  = true; break;
		case KEY.S:     key_state.down  = true; break;
		case KEY.Z:     key_state.z     = true; break;
	}
}
function keyUp(e) {
	switch(e.keyCode) {
		case KEY.RIGHT: key_state.right = false; break;
		case KEY.D:     key_state.right = false; break;
		case KEY.UP:    key_state.up    = false; break;
		case KEY.W:     key_state.up    = false; break;
		case KEY.LEFT:  key_state.left  = false; break;
		case KEY.A:     key_state.left  = false; break;
		case KEY.DOWN:  key_state.down  = false; break;
		case KEY.S:     key_state.down  = false; break;
		case KEY.Z:     key_state.z     = false; break;
	}
}
function mouseMove(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

//２点間の距離を求める
function getDistance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

//後で改変できないようにセキュリティーを上げる。
var map_size = 32;
var map1 = [];
//map1の情報を読む。
var map_chip=[];
for (var i = map_size - 1; i >= 0; i--) {
	map_chip[i]=[];
	for (var j = map_size - 1; j >= 0; j--) {
		map_chip[i][j] = {id:0, movable:true, hp:0};//とりあえず初期化（これがないと書き込めない）
		map_chip[i][j].id = Math.floor(Math.random()*4);
		if(map_chip[i][j].id==0){
			map_chip[i][j].movable = true;
			map_chip[i][j].hp = 0;
		}else if(map_chip[i][j].id==1){
			map_chip[i][j].movable = false;
			map_chip[i][j].hp = 0;
		}else if(map_chip[i][j].id==2){
			map_chip[i][j].movable = false;
			map_chip[i][j].hp = 10;
		}else if(map_chip[i][j].id==3){
			map_chip[i][j].movable = false;
			map_chip[i][j].hp = 5;
		}
	}
}
var map_pic_number = {floor:7, water:5, wall:3, column:2};
var map_pic = {floor:Array(map_pic_number.floor), water:Array(map_pic_number.water), wall:Array(map_pic_number.wall), column:Array(map_pic_number.column)};
for (var i = map_pic_number.floor - 1; i >= 0; i--) {
	map_pic.floor[i] = new Image();
	map_pic.floor[i].src = "floor"+i+".png?" + new Date().getTime();
};
for (var i = map_pic_number.water - 1; i >= 0; i--) {
	map_pic.water[i] = new Image();
	map_pic.water[i].src = "water"+i+".png?" + new Date().getTime();
};
for (var i = map_pic_number.wall - 1; i >= 0; i--) {
	map_pic.wall[i] = new Image();
	map_pic.wall[i].src = "wall"+i+".png?" + new Date().getTime();
};
for (var i = map_pic_number.column - 1; i >= 0; i--) {
	map_pic.column[i] = new Image();
	map_pic.column[i].src = "column"+i+".png?" + new Date().getTime();
};



object=[];//飛ぶ物体
for (var i = 256 - 1; i >= 0; i--) {
	object[i] = {id:0, x:0, y:0, v:0, arg:0, r:0};
}


var win = {x:640, y:480};
var my = {id:"", x:map_size*32/2, y:map_size*32/2, arg:0, v:2, r:3};
var mouse = {x:my.x, y:my.y};
/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 本体
*/

$(function(){
	setupDes();
	$("#login_button").click(function(){
		if($("#login_ID").val()!="ID"){
			if($("#login_password").val()==" "){
				my.id = $("#login_ID").val();
				//ログイン成功
				$("#login_form").css("opacity","0")
				$("#chat_form").css("opacity","1")
				var r;
				win.x = $(window).width();
				win.y = $(window).height();
				$("#canvas")[0].width = win.x;
				$("#canvas")[0].height = win.y;
				var scene = setInterval("parallel_wonder()", 1000/60);
			}else{
				alert("パスワードが違います");
			}
		}else{
			alert("IDが空です");
		} 
	})
});

//自分が動く
function my_move(){
	var vec = {x:0, y:0};
	if(key_state.right){
		vec.x+=1;
	}
	if(key_state.left){
		vec.x-=1;
	}
	if(key_state.up){
		vec.y-=1;
	}
	if(key_state.down){
		vec.y+=1;
	}
	if(vec.x!=0 || vec.y!=0){
		var r = getDistance(vec.x,vec.y,0,0);
		my.x += my.v*vec.x/r;
		my.y += my.v*vec.y/r;
		if(my.x>map_size*32 || my.x<0 || my.y<0 || my.y>map_size*32){//画面外には出れない
			my.x -= my.v*vec.x/r;
			my.y -= my.v*vec.y/r;
		}else if(Math.floor((my.x-my.v*vec.x/r)/32)!=Math.floor(my.x/32)){
			if(map_chip[Math.floor(my.x/32)][Math.floor(my.y/32)].movable==false){//壁なら　x方向におしかえす
				my.x -= my.v*vec.x/r;
			}
		}else if(Math.floor((my.y-my.v*vec.y/r)/32)!=Math.floor(my.y/32)){
			if(map_chip[Math.floor(my.x/32)][Math.floor(my.y/32)].movable==false){//壁なら　y方向におしかえす
				my.y -= my.v*vec.y/r;
			}
		}
	}
	my.arg = Math.atan2(mouse.y - win.y/2, mouse.x - win.x/2);//自分の向いている角度
}
//自分が銃弾を撃つ
function my_shoot(){
	for (var i = object.length - 1; i >= 0; i--) {
		if(object[i].id == 0){
			object[i].id = 1;
			object[i].x = my.x;
			object[i].y = my.y;
			object[i].v = 10;
			object[i].arg = my.arg;
			break;
		}
	}
}
//物体が動く
function object_move(){
	for (var i = object.length - 1; i >= 0; i--) {
		if(object[i].id == 1){
			object[i].x+=object[i].v*Math.cos(object[i].arg);
			object[i].y+=object[i].v*Math.sin(object[i].arg);
			if(object[i].x>map_size*32 || object[i].x<0 || object[i].y<0 || object[i].y>map_size*32){//画面外に出たら破壊
				object[i].id = 0;
			}else if(map_chip[Math.floor(object[i].x/32)][Math.floor(object[i].y/32)].hp>0){//壁なら攻撃
				map_chip[Math.floor(object[i].x/32)][Math.floor(object[i].y/32)].hp -= 1;
				if(map_chip[Math.floor(object[i].x/32)][Math.floor(object[i].y/32)].hp <= 0){//破壊処理
					map_chip[Math.floor(object[i].x/32)][Math.floor(object[i].y/32)].id = 0;
					map_chip[Math.floor(object[i].x/32)][Math.floor(object[i].y/32)].movable = true;
				}
				object[i].id = 0;//自分も破壊
			}
		}
	}
}
// function getFPS(fps_counter,start_time){
// 	var fps = 0;
// 	if(fps_counter==60){
// 		fps = 60/(new Date().getTime() - start_time);
// 		fps_counter = 0;
// 		start_time = new Date().getTime();
// 	}else{
// 		fps_counter++;
// 	}
// 	return {fps:fps, fps_counter:fps_counter, start_time:start_time}
// }

function parallel_wonder(){
	my_move();
	object_move();
	if(key_state.z){
		my_shoot();
	}
	//＝＝＝＝描画＝＝＝＝
	var offset = {x:win.x/2 - my.x, y:win.y/2 - my.y};
	//初期化
	var canvas = document.getElementById("canvas");
	var c = canvas.getContext("2d");
	c.clearRect(0, 0, win.x, win.y);
	//地形描画（奥から描画）
	for (var i = 0; i <= map_size - 1; i++) {
		for (var j = 0; j <= map_size - 1; j++) {
			if(map_chip[i][j].id==0){//床(floor)
				c.drawImage(map_pic.floor[1], i*32 + offset.x, j*32 + offset.y);
			}else if(map_chip[i][j].id==1){//水(water)
				c.drawImage(map_pic.water[0], i*32 + offset.x, j*32 + offset.y);
			}else if(map_chip[i][j].id==2){//壁(wall)
				c.drawImage(map_pic.floor[1], i*32 + offset.x, j*32 + offset.y);//まずは床を描画
				if(map_chip[i][j].hp>5){
					c.drawImage(map_pic.wall[1], i*32 + offset.x, j*32 + offset.y);
				}else{
					c.drawImage(map_pic.wall[0], i*32 + offset.x, j*32 + offset.y);
				}
			}else if(map_chip[i][j].id==3){//柱(column)
				c.drawImage(map_pic.floor[1], i*32 + offset.x, j*32 + offset.y);//まずは床を描画
				if(map_chip[i][j].hp>2){
					c.drawImage(map_pic.column[0], i*32 + offset.x, (j-1)*32 + offset.y);
				}else{
					c.drawImage(map_pic.column[1], i*32 + offset.x, (j-1)*32 + offset.y);
				}
			}
		}		
	}
	//オブジェクト描画
	for (var i = object.length - 1; i >= 0; i--) {
		if(object[i].id==1){//銃弾
			c.strokeStyle = "#000";
			c.lineWidth = 2;
			c.beginPath();
			c.arc(object[i].x + offset.x, object[i].y + offset.y, 2, 0, Math.PI*2);
			c.stroke();
		}
	}
	//自分の描画
	c.fillStyle = "#000";
	c.beginPath();
	c.arc(win.x/2, win.y/2, 5, 0, Math.PI*2);
	c.fill();

	//マウス描画
	c.strokeStyle = "#000";
	c.lineWidth = 1;
	c.beginPath();
	c.arc(mouse.x, mouse.y, 10, 0, Math.PI*2);
	c.stroke();
}