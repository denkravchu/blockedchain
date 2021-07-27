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