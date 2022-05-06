var ta = document.getElementsByTagName('textarea');
for (var i = 0; i < ta.length; i++) {
	ta[i].onkeydown = function(e) {
		if (e.keyCode == 9 || e.which == 9) {
			e.preventDefault();
			var s = this.selectionStart;
			this.value = this.value.substring(0,this.selectionStart) + "\ \ " + this.value.substring(this.selectionEnd);
			this.selectionEnd = s+1;
		}
	}
}
