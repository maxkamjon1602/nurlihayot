// const f = require("node-fetch");

document.addEventListener("DOMContentLoaded", function(){

  el_autohide = document.querySelector('.autohide');
  
  // add padding-top to body (if necessary)
  navbar_height = document.querySelector('.navbar').offsetHeight;
  document.body.style.paddingTop = navbar_height + 'px';

  if(el_autohide){
    var last_scroll_top = 0;
    window.addEventListener('scroll', function() {
          let scroll_top = window.scrollY;
         if(scroll_top < last_scroll_top) {
              el_autohide.classList.remove('scrolled-down');
              el_autohide.classList.add('scrolled-up');
          }
          else {
              el_autohide.classList.remove('scrolled-up');
              el_autohide.classList.add('scrolled-down');
          }
          last_scroll_top = scroll_top;
    }); 
    // window.addEventListener
		window.addEventListener("resize", function(){
			windowH();
		});
  }
  // if

	windowH();
  getJsonData();

  //   var img = el_home ? new Image() : document.createElement('img');
  //   img.src = src;
  //   if ( alt != null ) img.alt = alt;
  //   if ( title != null ) img.title = title;
  //   return img;
  // }


});
// DOMContentLoaded  end




const url = window.location.href;
console.log(url);

const getJsonData = async () => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1,
    }),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
      // return response.blob(); // MIME type to handle image
    })
    .then((data) => {
        // const data = response;
        console.log(data);
        return data;
    })
    .catch((error) => {
      console.log('error: ' + error);
    });
    
  // if(res.ok){
  //   const data = await res.json();
  //   console.log(data);
  //   return data;
  // }
}




















// IEWIN boolean previously sniffed through eg. conditional comments
// function img_create(src, alt, title) {
// 	var img = IEWIN ? new Image() : document.createElement('img');
// 	img.src = src;
// 	if ( alt != null ) img.alt = alt;
// 	if ( title != null ) img.title = title;
// 	return img;
// }

	// if(post[0] !== undefined) {
		// const para = img_create(post);\
		// const para = document.createElement("p");
		// const node = document.createTextNode(`hi`);
		// para.appendChild(node);
			
		// const element = document.getElementById("home");
		// element.appendChild(para);
	// }

function img_create(post) {
	var img = post ? new Image() : document.createElement('img');
	img.src = `data:image/${post[0].file.contentType};base64, ${post[0].file.data.toString('base64')}`;
	if ( alt != null ) img.alt = `${post.title}`;
	if ( title != null ) img.title = `${post.title}`;
	return img;
}





// const $home = document.querySelector("#home");
// // Simulate a request to load data and render it to the parent element;
// function loadItems(number) {
// 		new Promise((resolve) => {
// 				setTimeout(() => {
// 						resolve(Array(number).fill("A new Item"));
// 				}, 500);
// 		}).then((data) => {
// 				const html = data.map((item) => `<p>${item}</p>`);
// 				$home.innerHTML += html.join("");
// 		});
// }

// const intersectionObserver = new IntersectionObserver(function (entries) {
// 		// If intersectionRatio is 0, the target is out of view
// 		// and we do not need to do anything.
// 		console.log(entries);
// 		if (entries[0].isIntersecting) {
// 				loadItems(20);
// 				console.log("Loaded new items");
// 		}
// });
// // start observing

// intersectionObserver.observe(document.querySelector(".virtual"));

// document.querySelector(".btn").onclick = () => {
// 		intersectionObserver.unobserve(document.querySelector(".virtual"));
// };

// document.querySelector(".btn-re").onclick = () => {
// 		intersectionObserver.observe(document.querySelector(".virtual"));
// };












// var firstTabEl = document.querySelector('#myTab li:last-child a')
// var firstTab = new bootstrap.Tab(firstTabEl)

// firstTab.show()










// _this.element property is not defined before function is invoked. var postLink = document.getElementById("postlink").clientWidth
// window.onload = function(){
//   console.log('first');

//   var postLinkH = document.querySelector("#home");
//   console.log(postLinkH.innerHTML);


//   console.log('second');
// }











function windowH() {
	var wH = $('.udetail-postlink').width();
	
	$('.udetail-postlink').css({height: wH});	
	$('.udetail-postlink').css({maxHeight: wH});
}