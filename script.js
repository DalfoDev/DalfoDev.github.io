// JavaScript for smooth scrolling and navbar animation
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section');
  const navbarHeight = navbar.offsetHeight;
  const scrollThreshold = 50; // Adjust this value as needed
  let isNavbarPill = false;

  window.addEventListener('scroll', toggleNavbar);

  function toggleNavbar() {
    const shouldToggle = window.pageYOffset > scrollThreshold;

    if (shouldToggle && !isNavbarPill) {
      navbar.classList.add('pill');
      isNavbarPill = true;
    } else if (!shouldToggle && isNavbarPill) {
      navbar.classList.remove('pill');
      isNavbarPill = false;
    }
  }

  const links = document.querySelectorAll('.navbar a');

  for (let link of links) {
    link.addEventListener('click', scrollToSection);
  }

  function scrollToSection(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    window.scrollTo({
      top: targetSection.offsetTop - navbarHeight,
      behavior: 'smooth'
    });
  }

  // Typing animation
  const typedTextElement = document.querySelector('.typed-text');
  const textToType = 'Software_Engineer';
  const typingDelay = 100; // Adjust typing speed (milliseconds)
  const erasingDelay = 50; // Adjust erasing speed (milliseconds)
  const newTextDelay = 2000; // Delay between erasing and typing (milliseconds)

  let currentIndex = 0;
  let typingTimer = null;

  function type() {
    if (currentIndex < textToType.length) {
      typedTextElement.textContent += textToType.charAt(currentIndex);
      currentIndex++;
      typingTimer = setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (currentIndex > 0) {
      typedTextElement.textContent = textToType.substring(0, currentIndex - 1);
      currentIndex--;
      typingTimer = setTimeout(erase, erasingDelay);
    } else {
      setTimeout(type, typingDelay);
    }
  }

  type();

  // Light
  const createLightElement = (left, top) => {
    const light = document.createElement('div');
    light.classList.add('cursor-light');
    light.style.left = left + 'px';
    light.style.top = top + 'px';
    document.body.appendChild(light);
    return light;
  };

  const removeLightElement = (light) => {
    document.body.removeChild(light);
  };

  document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX + window.pageXOffset;
    const mouseY = event.clientY + window.pageYOffset;

    const existingLights = document.querySelectorAll('.cursor-light');
    existingLights.forEach((light) => {
      removeLightElement(light);
    });

    const light = createLightElement(mouseX, mouseY);

    setTimeout(() => {
      removeLightElement(light);
    }, 1000);
  });

  const cards = document.querySelectorAll('.card');




const lines = document.querySelectorAll('.line');

lines.forEach(line => {
  line.addEventListener('click', () => {
    lines.forEach(line => line.classList.toggle('active'));
  });
});

});

let isNavBarVisible = false;
let isMobileViewport = window.innerWidth <= 768; // Check if viewport is initially in mobile mode

function toggleNavBar() {
  const navBar = document.getElementById("navBar");
  const lines = document.querySelectorAll('.line');

  if (isMobileViewport) {
    if (!isNavBarVisible) {
      navBar.style.display = "block";
      fadeInElements();
      lines.forEach(line => line.classList.add('active'));
      isNavBarVisible = true;
    } else {
      removeFadeInClass();
      lines.forEach(line => line.classList.remove('active'));
      setTimeout(function() {
        navBar.style.display = "none";
        isNavBarVisible = false;
      }, 500);
    }
  }
}

// Event listener to detect changes in viewport width
window.addEventListener('resize', function() {
  const newIsMobileViewport = window.innerWidth <= 768;

  if (!newIsMobileViewport && isNavBarVisible) {
    const navBar = document.getElementById("navBar");
    const lines = document.querySelectorAll('.line');
    
    removeFadeInClass();
    lines.forEach(line => line.classList.remove('active'));
    setTimeout(function() {
      navBar.style.display = "none";
      isNavBarVisible = false;
    }, 500);
  }
  
  isMobileViewport = newIsMobileViewport;
});



function fadeInElements() {
  var elements = document.getElementsByClassName("fade-in-element");
  var delay = 150; // Delay between each element in milliseconds
  for (var i = 0; i < elements.length; i++) {
    (function(index) {
      setTimeout(function() {
        elements[index].classList.add("fade-in");
      }, delay * index);
    })(i);
  }
}

function removeFadeInClass() {
  var elements = document.getElementsByClassName("fade-in-element");
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove("fade-in");
  }
}
