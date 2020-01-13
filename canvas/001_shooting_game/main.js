var KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40, Z:90 };

//矢印キーの状態を覚えておく
var input = {
	right: false,
	up: false,
	left: false,
	down: false,
	z: false,
};

function keyDown(e) {
	switch(e.keyCode) {
		case KEY.RIGHT: input.right = true; break;
		case KEY.UP:    input.up    = true; break;
		case KEY.LEFT:  input.left  = true; break;
		case KEY.DOWN:  input.down  = true; break;
		case KEY.Z:     input.z     = true; break;
	}
}

function keyUp(e) {
	switch(e.keyCode) {
		case KEY.RIGHT: input.right = false; break;
		case KEY.UP:    input.up    = false; break;
		case KEY.LEFT:  input.left  = false; break;
		case KEY.DOWN:  input.down  = false; break;
		case KEY.Z:     input.z     = false; break;
	}
}

var winX=1000,winY=1000;
function システム(){
	if(document.all){
		winX = document.body.clientWidth;
    winY = document.body.clientHeight;
	}else{
		winX = innerWidth;
		winY = innerHeight;
	}
}
var WIDTH = 640, HEIGHT = 480;
var mouseX = 100, mouseY = 240;
function mouseMove(e){
	mouseX = e.clientX-(winX-WIDTH)/2;
	mouseY = e.clientY-20;
}

function HSVtoRGB(a,b,c){for(var d,e,f;0>a;)a+=360;a%=360;if(0==b)return c=Math.round(c),{r:c,g:c,b:c};b/=255;var h=Math.floor(a/60)%6,k=a/60-h;a=c*(1-b);var g=c*(1-k*b);b=c*(1-(1-k)*b);switch(h){case 0:d=c;e=b;f=a;break;case 1:d=g;e=c;f=a;break;case 2:d=a;e=c;f=b;break;case 3:d=a;e=g;f=c;break;case 4:d=b;e=a;f=c;break;case 5:d=c,e=a,f=g;}var i=""+Math.round(d)+","+Math.round(e)+","+Math.round(f);return i;}

/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 画像
*/

var img = Array(24);
for (var i = img.length - 1; i >= 1; i--) {
	img[i] = new Image();
	img[i].src = "pic/"+i+".png?" + new Date().getTime();
};

/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * データ
*/

var my = {
	x : 320,
	y : 240,
	arg : 0,
	v : 3.0,
	argV : 0.1,
	r : 6,
	sArg : 0,
	sn : 3,
	f1 : 0,
	f2 : 0,
	hp : 1000,
	bNum : 192,
};
my.bNum=my.sn*64;

var b = {
	t : Array(my.bNum),
	x : Array(my.bNum),
	y : Array(my.bNum),
	arg : Array(my.bNum),
	v : Array(my.bNum),
	r : Array(my.bNum),
	f : Array(my.bNum),
};
for (var i = my.bNum - 1; i >= 0; i--) {b.t[i]=0;b.f[i]=0;};

var eNum = 32;
var e = {
	t : Array(eNum),//この値で行動パターンも決める
	hp : Array(eNum),//hpがマイナス＝爆発エフェクト
	x : Array(eNum),
	y : Array(eNum),
	arg : Array(eNum),
	v : Array(eNum),
	r : Array(eNum),
	vn : Array(eNum),//可視ノード
	in : Array(eNum),//実際のノード
	d : Array(eNum),//ノードの深度
	f : Array(eNum),
};
for (var i = 16 - 1; i >= 0; i--) {
	e.t[i]=Math.floor(Math.random()*10)+1;//本当は種類
	e.f[i]=0;
	e.hp[i]=1000;
	e.x[i]=640*Math.random();
	e.y[i]=480*Math.random();
	e.arg[i]=Math.PI*(0.8+0.4*Math.random());
	e.v[i]=0.3;
	e.r[i]=32.0;
	e.vn[i]=NaN;
	e.in[i]=NaN;
	e.d[i]=1;
	if(e.t[i]==1){
		e.vn[i]=Array(3);
		for (var j = eNum,t = 0; j >= 0, t<3; j--) {//j:こいつ
			e.vn[i][t]=j;
			e.in[i][t]=j;
			e.t[j]=1;
			e.f[j]=0;
			e.hp[j]=1000;
			e.x[j]=e.x[i]+Math.random()*100*Math.cos(Math.PI*2*Math.random());
			e.y[j]=e.y[i]+Math.random()*100*Math.sin(Math.PI*2*Math.random());
			e.arg[j]=e.arg[i];
			e.v[j]=0.3;
			e.r[j]=32.0;
			t++;
		};
	}
};

var eBNum = 32*eNum;
var eb = {
	t : Array(eBNum),
	x : Array(eBNum),
	y : Array(eBNum),
	arg : Array(eBNum),
	v : Array(eBNum),
	r : Array(eBNum),
	f : Array(eNum),
};
/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * ゲーム本体
*/

function 状態更新(w, h){

	//else if じゃないよ(同時押し判定可)(ここでは変形)
//	if (input.right){my.arg+=my.argV;}
//	if (input.left){my.arg-=my.argV;}
//	if (input.up){my.v=my.vMax;}else if(input.down){my.v=my.vMin;}else{my.v=my.vMid;}
	
	if(my.f2==0){//自機がいたら
		//自機動く
		//%の問題点：-1.5%2=0.5
		my.arg=Math.atan2( (Math.sin(my.arg)*3+Math.sin( Math.atan2( mouseY-my.y, mouseX-my.x)) )/4, (Math.cos(my.arg)*3+Math.cos( Math.atan2( mouseY-my.y, mouseX-my.x)) )/4 );
		my.x=( my.x*5+mouseX-my.v*3*Math.cos(my.arg) )/6;
		my.y=( my.y*5+mouseY-my.v*3*Math.sin(my.arg) )/6;
		//my.arg=Math.atan2( mouseY-my.y, mouseX-my.x );
		
		if(my.x<=0+my.r){my.x=my.r;}else if(my.x>=WIDTH-my.r){my.x=WIDTH-my.r;}
		if(my.y<=0+my.r){my.y=my.r;}else if(my.y>=HEIGHT-my.r){my.y=HEIGHT-my.r;}
		if(my.hp<=0){my.f2=1;my.hp=0;}
	}else{
		my.f2++;
		if(my.f2==100){//ゲームオ−バー
			my.f2=0;
			my.hp=1000;
		}
	}

	my.sArg+=0.15;
	//自分の弾
	for (var i = my.bNum - 1 ,t=0,n=0; i >= 0; i--) {//varの部分は２つ以上の変数を宣言出来る。
		if(b.t[i]==0 && b.f[i]==0 && my.f2==0){//通常弾発射
			if(input.z && t<my.sn){//my.snは発射弾数、my.argの不等式は発射間隔。
				b.t[i]=1;
				b.x[i]=my.x+10*Math.cos(my.sArg+t*2*Math.PI/my.sn);
				b.y[i]=my.y+10*Math.sin(my.sArg+t*2*Math.PI/my.sn);
				b.v[i]=12.0;
				b.arg[i]=my.arg;
				b.r[i]=1.5;
				t++;
			}/*else if(n<16 && my.sArg%5<0.2){//特殊弾発射
				b.t[i]=2;
				b.x[i]=my.x;
				b.y[i]=my.y;
				b.v[i]=10.0;
				b.arg[i]=my.arg+n*2*Math.PI/16;
				b.r[i]=1;
				n++;
			}*/
		}

		if(b.t[i]>0){//弾があったら
			if(b.f[i]==0){//弾が爆発してなければ
				b.x[i]+=b.v[i]*Math.cos(b.arg[i]);
				b.y[i]+=b.v[i]*Math.sin(b.arg[i]);

				if( b.x[i]<=0-b.r[i] ){
					b.arg[i]=Math.PI-b.arg[i];
					b.t[i]=0;
				}
				if( b.x[i]>=WIDTH+b.r[i] ){
					b.arg[i]=Math.PI-b.arg[i];
					b.t[i]=0;
				}
				if( b.y[i]<=0-b.r[i] ){
					b.arg[i]=-b.arg[i];
					b.t[i]=0;
				}
				if( b.y[i]>=HEIGHT+b.r[i] ){
					b.arg[i]=-b.arg[i];
					b.t[i]=0;
				}

				for (var j = eNum - 1,d = 0; j >= 0; j--){//敵との処理。
					if(e.t[j]>0 && e.f[j]==0){
						if(Math.pow(b.x[i]-e.x[j],2)+Math.pow(b.y[i]-e.y[j],2)<=Math.pow(b.r[i]+e.r[j],2)){//弾が敵に当たったら
							e.hp[j]-=b.r[i]*b.v[i];
							b.f[i]=1;
						}
						if(e.hp[j]<=0 && e.f[j]==0){
								e.f[j]=1;
								d=1;//下も消す
						}
						if (d!=0){break}else{d=0}
					}
				};
			}else{//弾が爆発していたら
				b.f[i]+=1;
				if(b.f[i]==10){
					b.f[i]=0;
					b.t[i]=0;
				}
			}
		}
	};

	//敵動く
	for (var i = eNum - 1; i >= 0; i--){
		if(e.t[i]>0){
			if(e.f[i]==0){
				e.x[i]+=e.v[i]*Math.cos(e.arg[i]);
				e.y[i]+=e.v[i]*Math.sin(e.arg[i]);

				if( e.x[i]<=0-e.r[i] ){//敵の場外フラグ。右から来る場合は、右の判定は無し。
					e.arg[i]=Math.PI-e.arg[i];
					e.f[i]=1;
				}
				if( e.y[i]<=0-e.r[i] ){
					e.arg[i]=-e.arg[i];
					e.f[i]=1;
				}
				if( e.y[i]>=HEIGHT+e.r[i] ){
					e.arg[i]=-e.arg[i];
					e.f[i]=1;
				}
				if(Math.pow(e.x[i]-my.x,2)+Math.pow(e.y[i]-my.y,2)<=Math.pow(e.r[i]+my.r,2) && my.hp>0){//自機の敵との接触
					my.hp-=e.r[i]*e.v[i];
					my.f1=1;
				}
			}else{
				e.f[i]+=1;
				if(e.f[i]==100){
					e.f[i]=0;
					e.t[i]=0;
				}
			}
		}
	};
}

/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 描画
*/

function 表示更新(w, h){
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.clearRect(0, 0, w, h);

	//自機の描画
	if(my.f2==0){
		c.fillStyle = "#000000";
		c.beginPath();//本体
		c.moveTo( my.x+my.r*Math.cos(my.arg), my.y+my.r*Math.sin(my.arg) );
		c.lineTo( my.x+my.r*Math.cos(my.arg+Math.PI*0.7), my.y+my.r*Math.sin(my.arg+Math.PI*0.7) );
		c.lineTo( my.x+my.r*Math.cos(my.arg-Math.PI*0.7), my.y+my.r*Math.sin(my.arg-Math.PI*0.7) );
		c.lineTo( my.x+my.r*Math.cos(my.arg), my.y+my.r*Math.sin(my.arg) );
		c.fill();

		if(input.z){//アミュレット
			for (var i = 0; i < my.sn; i++) {
				c.beginPath();
				c.arc( my.x+10*Math.cos(my.sArg+i*2*Math.PI/my.sn), my.y+10*Math.sin(my.sArg+i*2*Math.PI/my.sn), 2, 0, Math.PI*2, false );
				c.fill();
			};
		}

		c.strokeStyle = "#000000";//ガイド
		c.lineWidth = 1;
		c.beginPath();
		c.moveTo( my.x, my.y );
		c.lineTo( my.x+300*Math.cos(my.arg), my.y+300*Math.sin(my.arg) );
		c.arc( my.x+300*Math.cos(my.arg), my.y+300*Math.sin(my.arg), 2, 0, Math.PI*2, false );
		c.stroke();

		c.beginPath();//マウス位置
		c.arc( mouseX, mouseY, 10, 0, Math.PI*2, false );
		c.stroke();

		c.lineWidth = 5;//hpゲージ
		if(my.hp>=500){c.strokeStyle = "rgba(100,200,100,0.7)";}else{c.strokeStyle = "rgba(200,100,200,0.8)";}
		c.beginPath();
		c.arc( my.x, my.y, my.r+20, Math.PI*0.5, Math.PI*(0.5+2*my.hp/1000), false );
		c.stroke();
		if(my.f1==0){//＝＝＝＝＝＝＝＝＝＝＝＝ダメージエフェクト、途中＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

		}
	}else{
		c.strokeStyle = "rgba("+HSVtoRGB(my.f2*10,100,60)+","+(1.0-my.f2/100)+")";
		c.lineWidth = 30-my.f2/5;
		c.beginPath();
		c.arc(my.x, my.y, 200-my.f2, 0, Math.PI*2,false);
		c.stroke();
	}

	//自分の弾幕描画
	for (var i = my.bNum - 1; i >= 0; i--) {
		if(b.t[i]>0){
			if(b.f[i]==0){
				c.strokeStyle = "rgba(0,0,0,1)";
			}else{
				c.strokeStyle = "rgba("+HSVtoRGB(360*b.f[i]/10,100,190)+","+(0.6-b.f[i]/20)+")";
				if(i%3==0){//重い時は"lighter"をこれで代替
					c.strokeStyle = "rgba("+HSVtoRGB(360*b.f[i]/10,100,300)+",0.8)";
				}
				c.fillStyle = "rgba("+HSVtoRGB(360*b.f[i]/10+i*10,100,225+30*Math.random() )+","+(0.6-b.f[i]/20)+")";
				c.beginPath();
				//c.arc(b.x[i], b.y[i], b.r[i]+15*(i%7)/7, 0, Math.PI*2,false);
				c.moveTo( b.x[i]+b.r[i]*15*(i%7)/7, b.y[i] );
				c.lineTo( b.x[i]+b.r[i]*15*Math.cos(Math.PI*2/6)*(i%7)/7, b.y[i]+b.r[i]*15*Math.sin(Math.PI*2/6)*(i%7)/7 );
				c.lineTo( b.x[i]+b.r[i]*15*Math.cos(Math.PI*2/6*2)*(i%7)/7, b.y[i]+b.r[i]*15*Math.sin(Math.PI*2/6*2)*(i%7)/7 );
				c.lineTo( b.x[i]+b.r[i]*15*Math.cos(Math.PI*2/6*3)*(i%7)/7, b.y[i]+b.r[i]*15*Math.sin(Math.PI*2/6*3)*(i%7)/7 );
				c.lineTo( b.x[i]+b.r[i]*15*Math.cos(Math.PI*2/6*4)*(i%7)/7, b.y[i]+b.r[i]*15*Math.sin(Math.PI*2/6*4)*(i%7)/7 );
				c.lineTo( b.x[i]+b.r[i]*15*Math.cos(Math.PI*2/6*5)*(i%7)/7, b.y[i]+b.r[i]*15*Math.sin(Math.PI*2/6*5)*(i%7)/7 );
				c.lineTo( b.x[i]+b.r[i]*15*(i%7)/7, b.y[i] );//これが無いと線が結ばれない。
				//c.globalCompositeOperation = "lighter";//重いなら入れなくてよい。
				c.stroke();
				//c.globalCompositeOperation = "source-over";
				c.fill();
			}
			c.lineWidth = b.r[i];
			c.beginPath();
			c.moveTo( b.x[i]-b.r[i]*4*Math.cos(b.arg[i]), b.y[i]-b.r[i]*4*Math.sin(b.arg[i]) );
			c.lineTo( b.x[i]+b.r[i]*4*Math.cos(b.arg[i]), b.y[i]+b.r[i]*4*Math.sin(b.arg[i]) );
//			c.moveTo( b.x[i]-b.r[i]*2*Math.cos(b.arg[i]+Math.PI/2), b.y[i]-b.r[i]*2*Math.sin(b.arg[i]+Math.PI/2) );
//			c.lineTo( b.x[i]+b.r[i]*2*Math.cos(b.arg[i]+Math.PI/2), b.y[i]+b.r[i]*2*Math.sin(b.arg[i]+Math.PI/2) );
			c.stroke();
			//c.fillText("r:"+b.r[i],b.x[i]+20,b.y[i]);
		}
	};

	//敵の描画
	for (var i = eNum - 1 ,t=0; i >= 0; i--) {//varの部分は２つ以上の変数を宣言出来る。
		if(e.t[i]>0){
			if(e.f[i]==0){
				c.drawImage(img[e.t[i]], e.x[i]-e.r[i], e.y[i]-e.r[i]);
				//デバッグ用
//				c.strokeStyle = "rgba("+HSVtoRGB(-360*e.hp[i]/100,100,150)+",0.7)";
//				c.lineWidth = 5;
//				c.beginPath();
//				c.arc(e.x[i], e.y[i], e.r[i], Math.PI*0.5, Math.PI*(0.5+2*e.hp[i]/1000),false);
//				c.stroke();
			}else{
				c.strokeStyle = "rgba("+HSVtoRGB(360*(i%11)/10,100,60)+","+(1.0-e.f[i]/100)+")";
				c.lineWidth = 20-e.f[i]/5;
				c.beginPath();
				c.arc(e.x[i], e.y[i], e.r[i]+50-e.f[i]*0.5, 0, Math.PI*2,false);
				c.stroke();
			}
		}
	};
}


/*==============================
 * タイマーおよび制御部門
 */

function start(){
	システム();
	system = setInterval("システム()", 1000);
	scene1 = setInterval("時間経過()", 1000/60);
}
function 時間経過(){
	状態更新(WIDTH, HEIGHT);
	表示更新(WIDTH, HEIGHT);
}

/*
var title = new Image();
title.src = "title.png?" + new Date().getTime();
var startButton = new Image();
startButton.src = "Start.png?" + new Date().getTime();
var title2 = new Image();
title2.src = "test.png?" + new Date().getTime();

function top(){
	setInterval(function(){
		ctx.drawImage(title, 0, 0);
		var t = Math.round(Math.random() * 2);
		ctx.shadowColor = 'rgba(0, 0, 0, 0)';
		ctx.drawImage(startButton, 0, t*70, 200, 70, 220+Math.round(Math.random() * 3), 300+Math.round(Math.random() * 3), 200, 70);
	
		ctx.beginPath();
		ctx.lineWidth = t;
		ctx.strokeStyle = 'rgb(0,0,0)';
		ctx.shadowColor = 'rgb(150, 0, 0)';
		ctx.shadowBlur = 3+t;
		ctx.moveTo(Math.round(Math.random() * 640), 0);
		ctx.lineTo(Math.round(Math.random() * 640), 480);
		ctx.moveTo(0, Math.round(Math.random() * 480));
		ctx.lineTo(640, Math.round(Math.random() * 480));
		ctx.stroke();
		ctx.globalAlpha =Math.random()/5;
		ctx.drawImage(title2, 0, 0);
		ctx.globalAlpha = 1.0;
	}, 1000/30);
}
*/