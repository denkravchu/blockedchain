var accr = document.getElementsByClassName("accordion"), accr_i;
for(accr_i = 0; accr_i < accr.length; accr_i++){
	accr[accr_i].addEventListener("click", function() {
		this.classList.toggle("active");
		var p = this.getElementsByClassName("accordion-content")[0];
		if(p.style.maxHeight) p.style.maxHeight = null;
		else p.style.maxHeight = p.scrollHeight + "px";
	});
}

function toggleMenu(){
	document.body.classList.toggle("nav-menu-active");
}

document.getElementsByClassName("mobile-nav")[0].addEventListener("click", function() {
	toggleMenu();
});

document.getElementsByClassName("mobile-close-nav")[0].addEventListener("click", function() {
	toggleMenu();
});

// Ring skew ---------------------------
window.addEventListener('load', () => {
	skewRing()
})

function skewRing() {
	const ring = document.querySelector('#ring')
	if (!ring) return

	window.addEventListener('mousemove', e => {
		const cursorPosition = getCursorPositionFromCenter(e)
		const skewMatrix = getSkewMatrix(cursorPosition)
		ring.style.cssText = `
			transform: matrix(${skewMatrix});
			transition: transform .1s ease;
		`
	})
}

function getCursorPositionFromCenter(e) {
	return {
		x: e.clientX - window.innerWidth / 2,
		y: e.clientY - window.innerHeight / 2
	}
}

function getSkewMatrix(cursorPosition) {
	const m = {
		a: 1 - cursorPosition.x / 5000, b: cursorPosition.x / 5000,
		c: cursorPosition.y / 5000, d: 1,
		tx: cursorPosition.x / 10, ty: cursorPosition.y / 10
	}
	return `${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.tx}, ${m.ty}`
}
