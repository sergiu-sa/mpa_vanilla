if ("serviceWorker" in navigator) {
  // Register our service worker file
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

// Request notification permission on page load
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Fetch products from DummyJSON and display them
fetch("https://dummyjson.com/products")
  .then((response) => response.json())
  .then((data) => {
    const products = data.products;
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    products.forEach((product) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div>${product.brand}</div>
      `;
      productsDiv.appendChild(div);
    });
  })
  .catch((error) => {
    document.getElementById("products").innerText = "Failed to load products.";
    console.error(error);
  });
