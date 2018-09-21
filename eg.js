function cl() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function eg(){
x=document.getElementsByClassName("flip-container");  
for(var i = 0; i < x.length; i++){
var color = cl();
x[i].innerHTML="<div style=\"color:"+ color +";background-color: black;\" class=\"hdp\">C<\/div>";
}
document.getElementsByClassName("site-footer")[0].innerHTML="<marquee id=\"marq\" class =\"footer-text\"style=\"color:"+ color +";background-color: black;\"> 🔃 Reload - Reload - Reload - Reload 🔃<\/marquee>";
setInterval(lop, 300);
};

function lop() {
    y=document.getElementsByClassName("hdp");
	for(var f = 0; f < y.length; f++){
	var color = cl();
	y[f].style.color = color;
	var color = cl();
	document.getElementById("marq").style.color = color;
}
};


var word = "-caml";
var input = "";
document.body.addEventListener('keypress',function(ev){
    input += String.fromCharCode(ev.keyCode);
    if(input == word){
        eg();
        input = "";
    }
});

document.body.addEventListener('keyup',function(ev){
    if(ev.keyCode == 27) input = "";
});


function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(){
    var newq = makeNewPosition();
    $('.hdp').animate({ top: newq[0], left: newq[1] }, function(){
      animateDiv();        
    });
    
};