let cart = [];

function addSelectedItem(name, selectId) {
  const select = document.getElementById(selectId);
  const price = Number(select.value);
  const optionText = select.options[select.selectedIndex].text;

  const itemName = `${name} - ${optionText.split(" - ")[0]}`;

  addToCart(itemName, price);
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();
  document.getElementById("cartDrawer").classList.add("active");
}

function increaseQty(name) {
  const item = cart.find(item => item.name === name);
  if (item) item.quantity += 1;
  updateCart();
}

function decreaseQty(name) {
  const item = cart.find(item => item.name === name);

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.name !== name);
  }

  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  }

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>Rs. ${item.price} × ${item.quantity}</p>

          <div class="qty-controls">
            <button onclick="decreaseQty('${item.name}')">−</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty('${item.name}')">+</button>
          </div>
        </div>

        <button onclick="removeFromCart('${item.name}')">×</button>
      </div>
    `;
  });

  cartCount.innerText = count;
  cartTotal.innerText = total;

  updateCheckout();
}

function toggleCart() {
  document.getElementById("cartDrawer").classList.toggle("active");
}

function updateCheckout() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");

  if (!checkoutItems || !checkoutTotal) return;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "Your cart is empty.";
    checkoutTotal.innerText = "0";
    return;
  }

  let total = 0;
  checkoutItems.innerHTML = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    checkoutItems.innerHTML += `
      <p>${item.name} × ${item.quantity} — Rs. ${itemTotal}</p>
    `;
  });

  checkoutTotal.innerText = total;
}

function placeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Order placed successfully! KIM'S will contact you soon.");

  cart = [];
  updateCart();
  event.target.reset();
}

function bookTable(event) {
  event.preventDefault();
  alert("Booking request sent! KIM'S will contact you soon.");
  event.target.reset();
}

const KIMS_LOCATION = {
  lat: 27.7485,
  lng: 85.3365
};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function getRoute() {
  if (!navigator.geolocation) {
    alert("Location is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distance = getDistanceKm(
        userLat,
        userLng,
        KIMS_LOCATION.lat,
        KIMS_LOCATION.lng
      );

      document.getElementById("distanceText").innerText =
        `You are approximately ${distance} km away from KIM'S.`;

      const url =
        `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${KIMS_LOCATION.lat},${KIMS_LOCATION.lng}&travelmode=driving`;

      window.open(url, "_blank");
    },
    function() {
      alert("Allow location access to show route.");
    }
  );
}

updateCart();