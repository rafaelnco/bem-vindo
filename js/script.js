var lastWidth = window.innerWidth;
var breakpoint = 768;
var lastSlide = 0;

var fulled = false,
	iframe = false,
	dragon = false,
	animEnter = 'fadeIn',
	animExit = 'fadeOut',
	loaded = [];

var $header = document.getElementsByClassName('site-header')[0],
	$menu = document.getElementsByClassName('menu')[0],
	$main = document.getElementsByClassName('swiper-container-main')[0],
	$Full = document.getElementsByClassName('presentator')[0],
	$dragon = document.getElementById('opensea'),
	$iframe = document.getElementById('externalview'),
	$scenes = document.querySelectorAll('#scene'),
	$parallax = [],
	$portfolioSlides = [];

var lastFull = undefined;

var swiperServices = undefined,
	swiperMulti = undefined,
	swiperBarber = undefined;

function loadjscssfile(filename, filetype, callback){
    if (filetype=="js"){
    	if (loaded.indexOf(filename)==-1) {
    		loaded = loaded.concat(filename)
	        var fileref=document.createElement('script')
	        fileref.setAttribute("type","text/javascript")
	        fileref.setAttribute("src", filename)
	        fileref.onload = callback
	    } else {
	    	callback();
	    }
    }
    else if (filetype=="css"){
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function hideSwiperFull() {
	if(!fulled)
		$Full.classList.add('hidden');
}
function hideFullDragon() {
	if(!dragon)
		$dragon.classList.add('hidden');
}
function hideIFrame() {
	if(!iframe) {
		$iframe.classList.add('hidden');
		$iframe.setAttribute('src','about:blank');
	}
}
/*function hideFull() {
	$Full.classList.remove(animEnter);
	$Full.classList.add(animExit);
	$Full.addEventListener('webkitAnimationEnd', hideSwiperFull);
	$Full.addEventListener('mozAnimationEnd', hideSwiperFull);
	$Full.addEventListener('MSAnimationEnd', hideSwiperFull);
	$Full.addEventListener('oanimationend', hideSwiperFull);
	$Full.addEventListener('animationend', hideSwiperFull);
}*/

function hide(el, callback) {
	el.classList.remove(animEnter);
	el.classList.add(animExit);
	el.addEventListener('webkitAnimationEnd', callback);
	el.addEventListener('mozAnimationEnd', callback);
	el.addEventListener('MSAnimationEnd', callback);
	el.addEventListener('oanimationend', callback);
	el.addEventListener('animationend', callback);
}
/*function showFull() {
	$Full.classList.remove(animExit);
	$Full.classList.add(animEnter);
	$Full.classList.remove('hidden');
}
function showFullDragon() {
	$dragon.classList.remove(animExit);
	$dragon.classList.add(animEnter);
	$dragon.classList.remove('hidden');
}*/
function show(element) {
	element.classList.remove(animExit);
	element.classList.add(animEnter);
	element.classList.remove('hidden');
}

function fullError(e) {
	console.log(e);
}

function unfull() {
	if(dragon) {
		dragon = false;
		hide($dragon, hideFullDragon);
	} else if(iframe) {
		iframe = false;
		hide($iframe, hideIFrame);
	} else {
		fulled = false;
		//hideFull();
		hide($Full, hideSwiperFull);
	}
}
function full(e, u) {
	iframe = true;
	
//	showFull();
	show($iframe);
	$iframe.setAttribute('src',u);
}

function full2(e, u) {
	fulled = true;
	var request = new XMLHttpRequest();
	request.open('GET', u, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    var resp = request.responseText;
	    document.getElementById('eexternalview').innerHTML = resp;
	//	showFull();
		show($Full);


		swiperBarber = new Swiper('.swiper-container-presentator', {
			nextButton: '.swiper-button-next-presentator',
			prevButton: '.swiper-button-prev-presentator',
			pagination: '.swiper-pagination-presentator',
			mousewheelControl: true,
			preloadImages: false,
			lazyLoading: true,
			watchSlidesVisibility: true,
			paginationClickable: true,
			spaceBetween: 0,
			speed: 170
		});
	  } else {
	    fullError(e);
	  }
	};

	request.onerror = function() {
	  fullError(e);
	};

	request.send();
}

function fullDragon(e, u) {
	dragon = true;
	var request = new XMLHttpRequest();
	request.open('GET', "dragon.html", true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    var resp = request.responseText;
	    //document.getElementById('opensea').innerHTML = resp;
	    $dragon.innerHTML = resp;
	    //showFullDragon();
	    show($dragon);

	    loadjscssfile('openseadragon.min.js','js', function() {
			var slider = document.getElementsByName('slider')[0];
			var viewer = OpenSeadragon({
				id: "openseadragon1",
				prefixUrl: "images/",
				tileSources: u + ".dzi",
				minZoomLevel: 0.5,
				maxZoomLevel: 3,
				defaultZoomLevel: 0,
				showNavigationControl: false
			});
			slider.addEventListener('input',function(a) {
				viewer.viewport.zoomTo(a.srcElement.value);
			});
			viewer.addHandler('zoom',function(event){
				slider.value = event.zoom;
			})
	    });

	  } else {
	    fullError(e);
	  }
	};

	request.onerror = function() {
	  fullError(e);
	};

	request.send();
}
var slides = document.getElementsByClassName('menu-item');

function dd(a, b) {
	return Math.max(a,b) - Math.min(a,b);
}
function slideTo(n) {
	var a = mainSwiper.activeIndex;
	var r = dd(n,a) > dd(n+5,a)? (n+5 > 6? n : n + 5) : n;
	var r2 = dd(n,a) > dd(n-5,a)? (n-5 < 0? n : n - 5) : n;
	mainSwiper.slideTo(dd(a,r) > dd(a,r2)? r2 : r);
}
function initServicesSwiper() {
	swiperServices = new Swiper('.swiper-container-services', {
	    slidesPerView: (window.innerWidth < breakpoint ? 1 : 3),
	    slidesPerColumn: (window.innerWidth < breakpoint ? 2 : 2),
	    nextButton: '.swiper-button-next-services',
	    prevButton: '.swiper-button-prev-services',
		pagination: '.swiper-pagination-services',
		lazyLoadingInPrevNext: true,
		watchSlidesVisibility: true,
	    paginationClickable: true,
		preloadImages: false,
		lazyLoading: true,
	    spaceBetween: 0,
		speed: 170
	});
}
function initPortfolioSwiper() {
	swiperMulti = new Swiper('.swiper-container-portfolio', {
	    slidesPerView: (window.innerWidth < breakpoint ? 1 : 3),
	    slidesPerColumn: (window.innerWidth < breakpoint ? 2 : 3),
	    nextButton: '.swiper-button-next-portfolio',
	    prevButton: '.swiper-button-prev-portfolio',
		pagination: '.swiper-pagination-portfolio',
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	    paginationClickable: true,
		preloadImages: false,
		lazyLoading: true,
	    spaceBetween: 0,
	    threshold:20,
		speed: 170
	});

	mainSwiper.on('onSlideChangeStart', function(instance) {
		if(mainSwiper.activeIndex === 4) {
			for(i = 0; i < $portfolioSlides.length; i++) {
				$portfolioSlides[i].startAutoplay();
			}
		} else {
			for(i = 0; i < $portfolioSlides.length; i++) {
				$portfolioSlides[i].stopAutoplay();
			}
		}
	});

	swiperMulti.on('onSlideChangeStart', function(instance) {
		for(i = 0; i < $portfolioSlides.length; i++) {
			if($portfolioSlides[i].container[0]
				.parentNode.parentNode //nice h4x0rzz
				.classList.contains('swiper-slide-visible')) {
				$portfolioSlides[i].startAutoplay();
			} else {
				$portfolioSlides[i].stopAutoplay();
			}
		}
	});

	var a = ['nereideadvocacia','ilbertleaffa', 'kamilastudio', 'barbeariacipriano'];
	for(i = 0; i < a.length; i++) {
		$portfolioSlides[i] = new Swiper('.swiper-container-'+a[i], {
		      pagination: '.swiper-pagination-'+a[i],
		      noSwipingClass: 'swiper-slide',
		      paginationClickable: true,
		      direction: 'vertical',
		      noSwiping: 'true',
		      preloadImages: false,
		      lazyLoading: true,
		      autoplay: 1500 + Math.random()*1000,
		      speed: 2000,
		});
	}
}
function checkSlide (e) {
	var classes = $header.classList;
	var mainClasses = $main.classList;
	//console.log(e.activeIndex%5);
	//$scenes = document.querySelectorAll('#scene');
    if(e.activeIndex%5 == 1) {
		if(classes.contains("morph"))
			classes.toggle("morph");
		/*if(!mainClasses.contains("morph"))
			mainClasses.toggle("morph");*/
		//console.log('bye');
		/*for(i = 0; i < $parallax.length; i++) {
			$parallax[i].enable();
		}*/
			//console.log($parallax[i].enabled);
    } else {
		if(!classes.contains("morph"))
			classes.toggle("morph");
		/*if(mainClasses.contains("morph"))
			mainClasses.toggle("morph");*/
		//console.log('hi');
		/*for(i = 0; i < $parallax.length; i++) {
			$parallax[i].disable();
		}*/
			//console.log($parallax[i].enabled);
    }
    /*if(e.activeIndex%5 == 3 && !swiperServices) {
    	initServicesSwiper();
    } else if(e.activeIndex%5 == 4 && !swiperMulti) {
    	initPortfolioSwiper();
    }*/
}

function checkMenuItem(el) {
	var W = $menu.offsetWidth,
		w = W / 5;
		n = -1;
	n = el%5;
	if(n < 0) { n += 5; }
	if(W > window.innerWidth) {
		var newScroll = w*n+ w/2 - window.innerWidth/2;
		TinyAnimate.animate($header.scrollLeft, newScroll, 400, function(x) {
		    $header.scrollLeft = x;
		});
	}
	slides[n].classList.toggle('active');
}
function checkMenu(e) {
//	if(lastSlide>1)
		checkMenuItem(lastSlide-1);
//	if(e.activeIndex>1)
		checkMenuItem(e.activeIndex-1);
	lastSlide = e.activeIndex;
}

function sliderHandler(e) {
	checkSlide(e);
	checkMenu(e);
}

var mainSwiper = new Swiper('.swiper-container-main', {
	watchSlidesVisibility: true,
	watchSlidesProgress: true,
    mousewheelControl: true,
    direction: 'vertical',
    centeredSlides: true,
    grabCursor: 'true',
	lazyLoading: true,
    spaceBetween: 0,
    //hashnav: true,
    /*autoHeight: true,*/
    threshold:20,
	speed: 500,
    loop: true
});
var bgSwiper = new Swiper('.swiper-container-bg', {
	watchSlidesVisibility: true,
	watchSlidesProgress: true,
    mousewheelControl: true,
    centeredSlides: true,
    grabCursor: 'true',
	lazyLoading: true,
    spaceBetween: 0,
    //hashnav: true,
		      noSwipingClass: 'swiper-slide',

		      noSwiping: 'true',
    threshold:20,
	speed: 300,
    /*loop: true*/
});
var swiperV = new Swiper('.swiper-container-manifesto', {
    nextButton: '.swiper-button-next-manifesto',
    prevButton: '.swiper-button-prev-manifesto',
	pagination: '.swiper-pagination-manifesto',
	lazyLoadingInPrevNext: true,
    paginationClickable: true,
	preloadImages: false,
    grabCursor: 'true',
	lazyLoading: true,
	nested: true,
	speed: 300
});
/*var swiperS = new Swiper('.swiper-container-social', {
	speed: 170,
    threshold:20
});*/
//var swiperFull = new Swiper('.swiper-container-full', {});
    /*noSwiping: 'true',
    noSwipingClass: 'swiper-slide'*/
$scenes = document.querySelectorAll('#scene');

//var a = document.querySelectorAll('#scene');
/*for(i = 0; i < $scenes.length; i++) {
	$parallax[i] = new Parallax($scenes[i]);
}*/
	//onsole.log($parallax[i].enabled);

checkSlide(mainSwiper);
lastSlide = mainSwiper.activeIndex;
checkMenuItem(lastSlide-1);

//sliderHandler(mainSwiper);

/*mainSwiper.on('slideChangeEnd', sliderHandler);*/
mainSwiper.on('slideChangeStart', sliderHandler);
/*mainSwiper.on('slideChangeEnd',
	function(e) {
		console.log(e);
	});
mainSwiper.on('touchStart',
	function(e) {
		console.log('start '+e);
	});*/
mainSwiper.on('touchStart', sliderHandler);
mainSwiper.on('touchEnd', sliderHandler);


window.onresize = function(event) {
	if((lastWidth <= breakpoint && window.innerWidth > breakpoint)
		|| (lastWidth > breakpoint && window.innerWidth <= breakpoint)) {
		if(swiperMulti) {
			swiperMulti.destroy();
			initPortfolioSwiper();
		}
		if(swiperServices) {
		    swiperServices.destroy();
		    initServicesSwiper();
		}
	}
	lastWidth = window.innerWidth;
}

Ladda.bind('.ladda-button');

/*document.getElementById('uniqueiframe').onload = Ladda.stopAll;
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-63618500-3', 'auto');
ga('send', 'pageview');*/

//	alert('hi');
	//a.classList.remove(animEnter);
function startup(e) {
	var a = document.getElementsByClassName('splash')[0];
	a.classList.add(animExit);
	hide(a, function() {
		a.classList.add('hidden');
	});

	initServicesSwiper();
	initPortfolioSwiper();
}

//window.onload = startup;

window.onload = function() {
	var a = document.getElementsByClassName('bodybg')[0];
	a.classList.remove('hidden');
	a.classList.add(animEnter);
};

document.addEventListener("DOMContentLoaded", startup);


/*	var toCache = [
		"images/webdesign.jpg",
		"images/marketingdigital.jpg",
		"images/seo.jpg",
		"images/socialmedia.jpg",
		"barbeariacipriano/bg.jpg",
		"nereideadvocacia/bg_low.jpg",
		"kamilastudio/bg_low.jpg",
		"ilbertleaffa/bg_low.jpg"
	];
	for(i = 0; i < toCache.length; i++) {
		(new Image).src=toCache[i];
	}*/