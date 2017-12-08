'use strict';
var PIN_LENGTH = 8;
var AVATAR = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['flat', 'house', 'bungalo'];
var CHECK_IN = ['12:00', '13:00', '14:00'];
var CHECK_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var locationGeneratorX = function () {
  return getRandomRangeNumber(300, 900);
};
var locationGeneratorY = function () {
  return getRandomRangeNumber(100, 500);
};

function getRandomPost(number) {
  var locationX = locationGeneratorX();
  var locationY = locationGeneratorY();
  return {
    author: {
      avatar: 'img/avatars/user' + AVATAR[number] + '.png',
    },
    offer: {
      title: getRandom(TITLE),
      address: locationX + ', ' + locationY,
      price: getRandomRangeNumber(1000, 1000000),
      type: getRandom(TYPE),
      rooms: getRandomRangeNumber(1, 5),
      guests: getRandomRangeNumber(1, 5),
      checkin: getRandom(CHECK_IN),
      checkout: getRandom(CHECK_OUT),
      features: getRandomFeatures(),
      description: ' ',
      photos: [],
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
}

function getRandom(list) {
  var randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function getRandomRangeNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function unfadeMap() {
  document.querySelector('.map').classList.remove('map--faded');
}

function createPinElement(post) {
  var pin = document.createElement('button');
  pin.setAttribute('style', 'left: ' + post.location.x + 'px; top: ' + post.location.y + 'px;');
  pin.setAttribute('class', 'map__pin');

  var image = document.createElement('img');
  image.setAttribute('src', post.author.avatar);
  image.setAttribute('width', '40');
  image.setAttribute('height', '40');
  image.setAttribute('draggable', 'false');

  pin.appendChild(image);
  return pin;
}

var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var map = document.querySelector('.map');
var blocks = document.querySelector('.map__filters-container');

function generatePins() {
  var parent = document.querySelector('.map__pins');
  var pins = [];

  for (var i = 0; i < PIN_LENGTH; i++) {
    var post = getRandomPost(i);
    pins.push(post);
    var pin = createPinElement(post);
    parent.appendChild(pin);
  }

  return pins;
}

function generateCard(pin) {
  var card = cardTemplate.cloneNode(true);
  var cardParagraph = card.querySelectorAll('p');
  map.insertBefore(card, blocks);
  card.querySelector('h3').textContent = pin.offer.title;
  card.querySelector('small').textContent = getRandomRangeNumber(300, 900) + ', ' + getRandomRangeNumber(100, 500);
  card.querySelector('.popup__price').textContent = getRandomRangeNumber(1000, 1000000) + String.fromCharCode(8381) + '/ночь';

  switch (pin.offer.type) {
    case 'flat':
      card.querySelector('h4').textContent = 'Квартира';
      break;
    case 'bungalo':
      card.querySelector('h4').textContent = 'Бунгало';
      break;
    case 'house':
      card.querySelector('h4').textContent = 'Дом';
      break;
  }
  var featureContainer = card.querySelector('.popup__features');
  while (featureContainer.firstChild) {
    featureContainer.removeChild(featureContainer.firstChild);
  }
  var features = pin.offer.features;
  for (var i = 0; i < features.length; i++) {
    var featureElement = createFeatureElement(features[i]);
    featureContainer.appendChild(featureElement);
  }

  cardParagraph[2].textContent = pin.offer.rooms + ' для ' + pin.offer.guests + ' гостей';
  cardParagraph[3].textContent = 'Заезд после ' + pin.offer.checkin + ' , выезд до ' + pin.offer.checkout;

  cardParagraph[4].textContent = ' ';
  card.querySelector('img').src = 'img/avatars/user' + getRandom(AVATAR) + '.png';

  return pin;
}

function getRandomFeatures() {
  var cardFeatures = [];
  for (var i = 0; i < FEATURES.length; i++) {
    if (Math.random() > 0.5) {
      cardFeatures.push(FEATURES[i]);
    }
  }
  return cardFeatures;
}

function createFeatureElement(feature) {
  var featureElement = document.createElement('li');
  featureElement.setAttribute('class', 'feature feature--' + feature);
  return featureElement;
}

function initMap() {
  unfadeMap();
  var pins = generatePins();
  generateCard(pins[0]);
}

initMap();
