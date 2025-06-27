const likedProfiles = [];
const profiles = [];

const savedProfiles = localStorage.getItem("profiles");
if (savedProfiles) {
  profiles.push(...JSON.parse(savedProfiles));
}

let currentIndex = 0;

const form = document.getElementById('profileForm');
const nameInput = document.getElementById('name');
const aboutInput = document.getElementById('about');
const photoInput = document.getElementById("photo");

const card = document.getElementById('profileCard');

const showLikedBtn = document.getElementById('showLikedBtn');
const backBtn = document.getElementById('backBtn');

const likeCounter = document.getElementById('likeCounter');  // Добавили счётчик

function updateLikeCounter() {
  likeCounter.textContent = `Понравилось: ${likedProfiles.length}`;
}

if (profiles.length > 0) {
  showProfile(0);
}
updateLikeCounter(); // Инициализируем счётчик

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const about = aboutInput.value.trim();
  const photo = photoInput.value.trim();

  if (name && about && photo) {
    profiles.push({ name, about, photo });

    localStorage.setItem("profiles", JSON.stringify(profiles));

    nameInput.value = "";
    aboutInput.value = "";
    photoInput.value = "";

    if (profiles.length === 1) {
      showProfile(0);
    }
  }
});

function showProfile(index) {
  const profile = profiles[index];

  if (!profile) {
    card.style.display = "none";
    return;
  }

  card.innerHTML = `
    <div class="swipe-card" style="
      background: white;
      border-radius: 20px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      padding: 20px;
      text-align: center;
    ">
      <img src="${profile.photo}" alt="${profile.name}" style="width: 100%; border-radius: 16px; max-height: 300px; object-fit: cover;" />
      <h3>${profile.name}</h3>
      <p>${profile.about}</p>
    </div>
  `;

  card.style.display = "block";
  addSwipeListeners();
}

function like() {
  likedProfiles.push(profiles[currentIndex]);
  console.log('Поставили лайк:', profiles[currentIndex].name);
  updateLikeCounter();  // Обновляем счётчик
  nextProfile();
}

function nextProfile() {
  currentIndex++;
  if (currentIndex < profiles.length) {
    showProfile(currentIndex);
  } else {
    card.style.display = 'none';
    alert('Анкеты закончились!');
  }
}

showLikedBtn.addEventListener('click', () => {
  if (likedProfiles.length === 0) {
    alert('Пока нет понравившихся анкет');
    return;
  }

  card.innerHTML = likedProfiles.map(profile => `
    <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
      <img src="${profile.photo}" alt="${profile.name}" style="width: 100%; border-radius: 16px; max-height: 150px; object-fit: cover;" />
      <h3>${profile.name}</h3>
      <p>${profile.about}</p>
    </div>
  `).join('');

  card.style.display = 'block';
  backBtn.style.display = 'inline-block';
  showLikedBtn.style.display = 'none';
});

backBtn.addEventListener('click', () => {
  showProfile(currentIndex);
  backBtn.style.display = 'none';
  showLikedBtn.style.display = 'inline-block';
});

function addSwipeListeners() {
  const swipeCard = card.querySelector('.swipe-card');
  if (!swipeCard) return;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  swipeCard.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    swipeCard.style.transition = 'none';
    swipeCard.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  function onMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    const deltaX = currentX - startX;
    swipeCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`;
  }

  function onMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    swipeCard.style.transition = 'transform 0.3s ease';
    swipeCard.style.cursor = 'grab';

    const deltaX = e.clientX - startX;

    if (deltaX > 100) {
      swipeCard.classList.add('swiping');
      swipeCard.style.transform = 'translateX(500px) rotate(30deg)';
      setTimeout(like, 300);
    } else if (deltaX < -100) {
      swipeCard.classList.add('swiping');
      swipeCard.style.transform = 'translateX(-500px) rotate(-30deg)';
      setTimeout(nextProfile, 300);
    } else {
      swipeCard.style.transform = 'translateX(0) rotate(0)';
    }
  }
}