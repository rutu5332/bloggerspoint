var image=["i2" , "i6" , "i3" , "i11" ];
i=image.length;
function nxt()
{
	if (i<image.length){ 	
		i=i+1;
	}
	else
	{
		i=1;
	}
	document.getElementById('slide').innerHTML="<img src=\"/static/img/"+image[i-1]+".jpg\">";
}
function prew()
{
	if (i<image.length+1 && i>1)
	{
		i =i-1;
	}
	else
	{
		i=image.length;
	}
	document.getElementById('slide').innerHTML="<img src=\"/static/img/"+image[i-1]+".jpg\">";
}
setInterval(nxt,2000);