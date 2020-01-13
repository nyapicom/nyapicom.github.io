var Countdown = function(num) {
	var count = num;
	function updateCountdown() {
		if(count > 0){
			console.log(count)
			count-=1
		}else{
			clearInterval(interval)
			console.log("over")
		}
	}
	var interval = setInterval(updateCountdown, 1000)
}

var timer = new Countdown(10)

var timer2 = new Countdown(4)