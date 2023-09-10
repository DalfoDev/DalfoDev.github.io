document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navbarHeight = navbar.offsetHeight;
  const scrollThreshold = 50;
  let isNavbarPill = false;
  let isProjectsVisible = false;

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

    const projectsSection = document.getElementById('projects');
    if (isInViewport(projectsSection) && !isProjectsVisible) {
      animateCards();
      isProjectsVisible = true;
    }
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function animateCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
      const delay = index * 100;
      card.style.animationDelay = `${delay}ms`;
    });
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

  const mobileMenuLinks = document.querySelectorAll('.menu-nav-bar a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleNavBar();
    });
  });

  const typedTextElement = document.querySelector('.typed-text');
  const textToType = 'Software_Engineer';
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
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

  function createLightElement(left, top) {
    const light = document.createElement('div');
    light.classList.add('cursor-light');
    light.style.left = left + 'px';
    light.style.top = top + 'px';
    document.body.appendChild(light);
    return light;
  }

  function removeLightElement(light) {
    document.body.removeChild(light);
  }

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

  const lines = document.querySelectorAll('.line');

  lines.forEach(line => {
    line.addEventListener('click', () => {
      lines.forEach(line => line.classList.toggle('active'));
    });
  });

  let isNavBarVisible = false;
  let isMobileViewport = window.innerWidth <= 768;

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
        setTimeout(function () {
          navBar.style.display = "none";
          isNavBarVisible = false;
        }, 500);
      }
    }
  }

  window.addEventListener('resize', function () {
    const newIsMobileViewport = window.innerWidth <= 768;

    if (!newIsMobileViewport && isNavBarVisible) {
      const navBar = document.getElementById("navBar");
      const lines = document.querySelectorAll('.line');

      removeFadeInClass();
      lines.forEach(line => line.classList.remove('active'));
      setTimeout(function () {
        navBar.style.display = "none";
        isNavBarVisible = false;
      }, 500);
    }

    isMobileViewport = newIsMobileViewport;
  });

  const cardContainer = document.querySelector(".card-container");
  const cards = document.querySelectorAll(".card");

  function handleScroll() {
    const cardContainerRect = cardContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    cards.forEach((card, index) => {
      if (cardContainerRect.top < windowHeight) {
        card.style.animationDelay = `${index * 200}ms`;
        card.classList.add("fadeInTop");
      }
    });
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll);
});
