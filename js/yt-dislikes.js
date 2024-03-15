// Ezt kell futtatni:
(function getDislikes(){let urlObject=new URL(window.location.href),pathname=urlObject.pathname,videoId='',statsSet=false;if (pathname.startsWith('/clip')) videoId=document.querySelector('meta[itemprop="videoId"]').content;else{if (pathname.startsWith('/shorts')) videoId=pathname.slice(8);videoId=urlObject.searchParams.get('v')};fetch('https://returnyoutubedislikeapi.com/votes?videoId=' + videoId).then((response)=>{response.json().then((json)=>{if (json && !('traceId' in response) && !statsSet){const{ dislikes,likes }=json;setDislikes(dislikes)}})})})();
// Ez lesz az eredmény:
function setDislikes(d){let r='',dis=d;if (d>10000000){r=' M';dis=(Math.round(d/1000000))}else if (d>1000000){r=' M';dis=(Math.round(d/100000)/10)}else if (d>10000){r=' E';dis=(Math.round(d/1000))}else if (d>1000){r=' E';dis=(Math.round(d/100)/10)}r=(dis.toString().replace('.',',') + r);
	console.log(d);
	console.log(r);
}
