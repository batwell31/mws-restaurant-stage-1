let restaurants,
  neighborhoods,
  cuisines
var newMap
let markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiYmF0d2VsbDMxIiwiYSI6ImNqanE3ZGdpYjdva2YzcHI1ZHQ1c3Z4bzAifQ.bGMwlE6zU9ZVCmdH4VTRcg',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  // Creates the 'restaurant-img' HTML
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  let image_url = DBHelper.imageUrlForRestaurant(restaurant);
  const image_length = image_url.length;
  
  // This takes off '.jpg' from the img's URL
  image_url = image_url.substring(0, image_length - 4);
  
  // 3 variables for img's for 1x, 2x, and 3x displays
  const image_url_1x = image_url + "_320.jpg";
  const image_url_2x = image_url + "_503.jpg";
  const image_url_3x = image_url + "_900.jpg";
  
  // Sets the default img src to the smallest img variable
  image.src = image_url_1x;
  // This will allow the img's to be responsive, adjusting them to different vw sizes
  image.srcset = `${image_url_1x} 320w, ${image_url_2x} 503w, ${image_url_3x} 900w`;
  image.sizes = `(max-width: 320px) 320px, (max-width: 503px) 503px, 900px`;
  image.alt = `A picture of ${restaurant.name}, a ${restaurant.cuisine_type} restaurant located in ${restaurant.neighborhood}.`;
  li.append(image);

  // Creates the 'Name' Section
  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  // Creates the 'Neighborhood' Section
  const neighborhood = document.createElement('p');
  neighborhood.className = 'restaurant-neighborhood';
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  // Creates the 'Address' Section
  const address = document.createElement('p');
  address.className = 'restaurant-address';
  address.innerHTML = restaurant.address;
  li.append(address);

  // Creates the 'Button' Section
  const more = document.createElement('button');
  const label_attribute = document.createAttribute("aria-labelledby");
  let restaurantName = restaurant.name;  
  restaurantName = restaurantName.replace(/\s+/g, '');
  label_attribute.value = restaurantName + "_label";
  more.setAttributeNode(label_attribute);
  more.innerHTML = 'View Details';

  const aria_label = document.createElement('label');
  aria_label.id = restaurantName + "_label";
  aria_label.className = "aria-label";
  aria_label.innerHTML = "Link: Restaurant " + restaurant.name + " Details. Neighborhood: " + restaurant.neighborhood + " Address: " + restaurant.address;

  more.onclick = function () {
    const url = DBHelper.urlForRestaurant(restaurant);
    window.location = url;
  }

  li.append(more)
  li.append(aria_label)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

} 
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

