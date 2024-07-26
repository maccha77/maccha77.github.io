document.addEventListener('DOMContentLoaded', function () {
    const introScreen1 = document.getElementById('intro-screen-1');
    const introScreen2 = document.getElementById('intro-screen-2');
    const animationScreen = document.getElementById('animation-screen');
  
    introScreen1.addEventListener('click', function () {
      introScreen1.style.display = 'none';
      introScreen2.style.display = 'flex';
    });
  
    introScreen2.addEventListener('click', function () {
      introScreen2.style.display = 'none';
      animationScreen.style.display = 'block';
    });
  });
  
