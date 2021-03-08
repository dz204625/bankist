'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Button Scroll

btnScroollTo.addEventListener("click", function (e){
  /*const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log("current scroll", window.pageXOffset, window.pageYOffset);
  console.log("height/width viewport", document.documentElement.clientHeight, document.documentElement.clientWidth);

  //window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  window.scrollTo({
    left:s1coords.left + window.pageXOffset,
    top:s1coords.top + window.pageYOffset,
    behavior: "smooth"
  })*/

  section1.scrollIntoView({
    behavior: "smooth"
  })

})
// page navigation

//this method is not efficent bc it will create a same function copy on each one of button
// document.querySelectorAll('.nav__link').forEach(
//   function(el){
//     el.addEventListener('click', function(e){
//       e.preventDefault();
//       const id = this.getAttribute('href');
//       console.log(id);
//       document.querySelector(id).scrollIntoView({behavior: "smooth"} )
//     });
//   }
// )

//Event Deligation 
//1. add event listener to common parent element
//2. determin what elemnet originated the event

document.querySelector('.nav__links').addEventListener(
  'click',function(e){
    e.preventDefault();
    //matching strategy
    if(e.target.classList.contains('nav__link')){
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({behavior: "smooth"} );
    }
  }
)
//tab-component



tabsContainer.addEventListener('click', function(e){
  //e.preventDefault();

  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //guard clause
  if(!clicked) return;

//remove active classes
  tabs.forEach(t=> t.classList.remove('operations__tab--active'));

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));


  //active tab
  clicked.classList.add('operations__tab--active');

  //active content

  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
  
});

//menu fade animation

const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el=>{
      if(el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;

  }

}

// passing "argunment" into handler

nav.addEventListener('mouseover',handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/*
nav.addEventListener('mouseover', function(e){
  handleHover(e,0.5);
})

nav.addEventListener('mouseout', function(e){
  handleHover(e,1);
})*/

//sticky header

/*const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function(){
  console.log(window.scrollY);
  if(window.scrollY > initialCoords.top)nav.classList.add('sticky') 
  else nav.classList.remove('sticky')

})*/
/*
const obsCallback = function(entries, observer){
  entries.forEach(entry => {
    console.log(entry);
  })


}
const obsOptions = {
  root: null,
  threshold:[0,0.2]
};
 
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting)
  nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObeserver = new IntersectionObserver(
  stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
  }
);

headerObeserver.observe(header);

// revealing 
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;


if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);

}     

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold:0.15,
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
   
})

// lazy loading
const imgTargets = document.querySelectorAll('img[data-src');
console.log(imgTargets);

const loadImg = function(entries, observer){
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);

}

const imgObserver = new IntersectionObserver(loadImg, 
{
root: null,
threshold: 0,
rootMargin: '200px',
}
);

imgTargets.forEach(img => imgObserver.observe(img));

//slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function(){
  slides.forEach(function(_,i){
    dotsContainer.insertAdjacentHTML('beforeend', 
    `<button class ="dots__dot" data-slide ="${i}"></button`)
  });
};

createDots();


const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList
    .remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList
    .add('dots__dot--active');
};

activateDot(0);

const goToSlide = function(slide){
  slides.forEach((s, i) => s.style.transform = `translateX(${100*(i-slide)}%)`);

};

goToSlide(0);


//next slide

const nextSlide = function(){

  if(curSlide === (maxSlide-1)){
    curSlide = 0;
  }else{
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};
  
const prevSlide = function(){
  if(curSlide === 0){
    curSlide = maxSlide -1;
  }else{
    curSlide--;
  }
 
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);


document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotsContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
})














/*
//SELECT ELEMENT
//////////////////////////////////////////////////////////////////
console.log(document.documentElement);
console.log(document.head)
console.log(document.body)

const header = document.querySelector(".header");

//RETURN NODELIST
const allSections = document.querySelectorAll(".section");
console.log(allSections);

document.getElementById("section--1");

// RETURN HTML COLLECTION (it's live collection)
const allButtons = document.getElementsByTagName("button");
console.log(allButtons);

console.log(document.getElementsByClassName("btn"))

// creating and inserting elements

//.insertAdjacentHTML

const message = document.createElement("div");
message.classList.add("cookie-message");
message.textContent = "We use cookies for improved functionlity and analytics.";
message.innerHTML = `We use cookies for improved functionlity and analytics. 
<button class="btn btn--close-cookie">Got it! </button>`;

//insert as the first child element
//header.prepend(message);
//insert as the last child element 
header.append(message);

//header.append(message.cloneNode(true));

//insert as siblings 
//header.before(message);
//header.after(message);


//delete elements

document.querySelector(".btn--close-cookie").
addEventListener("click",function(){
  message.remove(); // this is new method
  //message.parentElement.removeChild(message);  how used to remove the child element
})

//style

//the style will insert as inline style
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10)+ 30 + "px";

document.documentElement.style.setProperty("--color-primary", "orangered");

//attributes 

const logo = document.querySelector(".nav__logo");
console.log(logo.src);

logo.getAttribute("src") // return img/logo.png return relative link
console.log(logo.className);

logo.alt = "custom alt";


console.log(logo.getAttribute("designer"));
logo.setAttribute("company", "Bankist")

//data attributes
console.log(logo.dataset.versionNumber);

//class
logo.classList.add("c" , "d");
logo.classList.remove("c" , "d");
logo.classList.toggle("c" , "d");
logo.classList.contains("c" , "d"); // not include


//Dont use this format, it will over write all the classname
//logo.className = "dan"
*/

/*
const btnScroollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScroollTo.addEventListener("click", function (e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log("current scroll", window.pageXOffset, window.pageYOffset);
  console.log("height/width viewport", document.documentElement.clientHeight, document.documentElement.clientWidth);

//scolling
  //window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  /*window.scrollTo({
    left:s1coords.left + window.pageXOffset,
    top:s1coords.top + window.pageYOffset,
    behavior: "smooth"
  })*/
/*
  section1.scrollIntoView({
    behavior: "smooth"
  })

})
const h1 = document.querySelector("h1");

const alertH1 = function(e){
  alert("add event listener in header");

  //ONLY LISTEN ONCE
  //h1.removeEventListener("mouseenter", alertH1); 
};

  //ONLY LISTEN ONCE
h1.addEventListener("mouseenter", alertH1);
setTimeout(()=> h1.removeEventListener("mouseenter", alertH1),3000);
//old school
// h1.onmouseenter = function(e){
//   alert("add event listener in header");
// };

//rgb (255, 255, 255)
const randomInt = (min, max) => Math.floor(Math.random()*(max-min+1) + min);

const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// stop the propagation() in general, not good idea to use
//e.stopPropageation();


const h1 = document.querySelector('h1');

//going downwards: child
console.log(h1.querySelectorAll('.highlight')); 
console.log(h1.childNodes);
console.log(h1.children);//direct children 

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//going upwards: parents

console.log(h1.parentNode);
console.log(h1.parentElement);

//closet parent element
h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

//going sideways: siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function(el){
  if(el !== h1) el.style.transform = 'scale(0.5)';

})

*/