document.addEventListener('DOMContentLoaded', function() {
    var occupationElement = document.getElementById('occupation');
    var text = occupationElement.innerText;
    typeLoop(text);
});

function typeLoop(text) {
    typeText(text, function() {
        deleteLoop(function() {
            typeLoop(text);
        });
    });
}

function typeText(text, callback) {
    var typingSpeed = 1500;
    var displayTime = 100;
    var occupationElement = document.getElementById('occupation');
    occupationElement.innerText = ''; // Clear the content before typing
    var index = 0;
    var interval = setInterval(function() {
        occupationElement.innerText += text[index];
        index++;
        if (index === text.length) {
            clearInterval(interval);
            setTimeout(function() {
                callback();
            }, typingSpeed);
        }
    }, displayTime);
}

function deleteLoop(callback) {
    var deleteSpeed = 100;
    var occupationElement = document.getElementById('occupation');
    var text = occupationElement.innerText;
    var index = text.length - 1;
    var interval = setInterval(function() {
        occupationElement.innerText = text.substring(0, index);
        index--;
        if (index < 0) {
            clearInterval(interval);
            callback();
        }
    }, deleteSpeed);
}


function initializeAnimation(targetSelector, outputContainerId) {
    const targetWordContainer = document.querySelector(targetSelector);
    const outputContainer = document.getElementById(outputContainerId);
  
    let targetWord = '';
    const delays = 1; // Adjust this value to control the typing speed
  
    function initializeOutputs() {
      typeAndDelete(outputContainer, targetWord);
    }
  
    function typeAndDelete(outputContainer, remainingChars) {
      if (remainingChars.length === 0) {
        return;
      }
  
      const outputElement = document.createElement('div');
      outputElement.className = 'output';
      outputContainer.appendChild(outputElement);
  
      const targetChar = remainingChars.charAt(0);
      let currentCharIndex = 32;
  
      function processCharacter() {
        const currentChar = String.fromCharCode(currentCharIndex);
  
        if (currentChar === targetChar) {
          outputElement.textContent += currentChar;
          remainingChars = remainingChars.substring(1); // Remove the first character
          typeAndDelete(outputContainer, remainingChars); // Continue with the next character
          return;
        } else {
          outputElement.textContent += currentChar;
          setTimeout(() => {
            outputElement.textContent = outputElement.textContent.slice(0, -1);
          }, delays);
        }
  
        currentCharIndex++;
  
        if (currentCharIndex < 127) {
          setTimeout(processCharacter, delays);
        }
      }
  
      processCharacter();
    }
  
    // Use Intersection Observer to trigger animation when the target element is fully in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect(); // Stop observing once the target is in view
          targetWordContainer.style.opacity = 1; // Make the target visible
          const h2Tag = targetWordContainer.querySelector('h2.animated-text');
          if (h2Tag) {
            targetWord = h2Tag.textContent.trim(); // Get text content and remove leading/trailing spaces
            initializeOutputs();
          } else {
            alert('No matching <h2> tag with class "animated-text" found.');
          }
        }
      });
    }, { threshold: 1 }); // Trigger when the target is fully in view
  
    observer.observe(targetWordContainer);
  }
  
  // Initialize animations
  initializeAnimation('#About', 'outputContainerAbout');
  initializeAnimation('#Projects', 'outputContainerProjects');
  initializeAnimation('#Contacts', 'outputContainerContacts');

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
  });