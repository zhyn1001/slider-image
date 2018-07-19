;(function(window){
	 function Slider(opts){
		this.wrap=opts.dom;//获取页面dom
		this.list=opts.list;//获取数据
		
		this.init();//数组函数
		this.renderDom();//渲染dom
		this.bindDom();//绑定事件
	}
	Slider.prototype.init = function(){
		//长宽比
		this.radio = window.innerHeight/window.innerWidth;
		//屏幕宽度
		this.scaleW = window.innerWidth;
		//初始化索引
		this.idx = 0;
	}
	Slider.prototype.renderDom = function(){
		var wrap = this.wrap;//容器
		var data = this.list;//图片数据
		var len = data.length;//长度
		var scale = this.scaleW;
		
		this.outer=document.createElement("ul");
		for(var i=0; i<len; i++){
			var item = data[i];
			var li = document.createElement("li");
			if(item){
				/*根据高宽比设置图片的高宽*/
				if(item['height']/item['width'] > this.radio){
					li.innerHTML = '<img src="'+item['url']+'" height="'+window.innerHeight+'">';
				}else{
					li.innerHTML = '<img src="'+item['url']+'" width="'+window.innerWidth+'">';
				}
			}
			li.style.webkitTransform = 'translate3d('+ i*scale +'px,0,0)';
			this.outer.appendChild(li)
		}
		wrap.style.height = window.innerHeight + 'px';
		wrap.appendChild(this.outer);
	}
	Slider.prototype.bindDom = function(){
		var self = this;
		var scale = self.scaleW;
		var outer = self.outer;
		var len = self.list.length;
		var startHandler = function(e){
			/*记录滑动初始坐标*/
			self.startX = e.touches[0].pageX;//手指当前的坐标
			self.offsetX = 0;//偏移位置
			self.startTime = new Date()*1;//时间戳
		}
		
		var moveHandler = function(e){
			e.preventDefault();//阻止浏览器的默认行为
			self.offsetX = e.touches[0].pageX - self.startX;
			
			var lis = outer.getElementsByTagName('li');
			
			var i = self.idx - 1;
			var m = self.idx + 1;
			
			for(i; i<=m; i++){
				lis[i] && (lis[i].style.webkitTransform='translate3d('+ ((i-self.idx)*scale + self.offsetX) +'px, 0, 0)')
				lis[i] && (lis[i].style.webkitTransition = 'none');
			}
		}
		
		var endHandler = function(e){
			var boundary = scale/6;
			var endTime = new Date()*1;
			
			if(endTime-self.startTime >= 800){
				if(self.offsetX >= boundary){//进入到上一页
					self.go('-1');
				}else if(self.offsetX <= -boundary){//进入到下一页
					self.go('+1');
				}else{//留在本页
					self.go('0');
				}
			}else{
				if(self.offsetX >= 50){//进入到上一页
					self.go('-1');
				}else if(self.offsetX <= -50){//进入到下一页
					self.go('+1');
				}else{//留在本页
					self.go('0');
				}
			}
		}
		outer.addEventListener('touchstart',startHandler);
		outer.addEventListener('touchmove',moveHandler);
		outer.addEventListener('touchend',endHandler);
	}
	
	Slider.prototype.go = function(n){
		var idx = this.idx;
		var cidx;
		var lis = this.outer.getElementsByTagName('li');
		var len = this.list.length;
		var scale = this.scaleW;
		
		if(typeof n == 'number'){
			cidx = idx;
		}else if(typeof n == 'string'){
			cidx = idx + n * 1;
		}
		//索引边界
		if(cidx > len - 1){
			cidx = len - 1;
		}else if(cidx <= 0){
			cidx = 0;
		}
		
		this.idx = cidx;
		
		lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
		lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
		lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
		
		lis[cidx].style.webkitTransform = 'translate3d(0,0,0)';
		lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(-'+ scale +'px,0,0)');
		lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d('+ scale +'px,0,0)');
		
	}
	window.Slider = Slider;
}(this))
