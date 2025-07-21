document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileProductsBtn = document.getElementById("mobile-products-btn");
  const mobileProductsMenu = document.getElementById("mobile-products-menu");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileProductsBtn.addEventListener("click", () => {
    mobileProductsMenu.classList.toggle("hidden");
    const icon = mobileProductsBtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  });

  // Search bar toggle
  const searchBtn = document.getElementById("search-btn");
  const searchBar = document.getElementById("search-bar");

  searchBtn.addEventListener("click", () => {
    searchBar.classList.toggle("hidden");
  });

  // Cart functionality
  const cartBtn = document.getElementById("cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCartBtn = document.getElementById("close-cart");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const cartSummary = document.getElementById("cart-summary");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Update cart count
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (totalItems > 0) {
      cartCount.classList.remove("hidden");
    } else {
      cartCount.classList.add("hidden");
    }
  }

  // Update cart sidebar
  function updateCartSidebar() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      cartSummary.classList.add("hidden");
    } else {
      emptyCartMessage.classList.add("hidden");

      let subtotal = 0;

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "flex items-start py-4 border-b border-gray-200";
        cartItem.innerHTML = `
                        <img src="${item.image}" alt="${
          item.name
        }" class="w-16 h-16 object-cover rounded">
                        <div class="ml-4 flex-grow">
                            <h4 class="font-medium">${item.name}</h4>
                            <p class="text-gray-600 text-sm">${item.price.toFixed(
                              2
                            )}€</p>
                            <div class="flex items-center mt-2">
                                <button class="decrease-quantity text-gray-500 hover:text-pink-600" data-id="${
                                  item.id
                                }">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="quantity mx-2">${
                                  item.quantity
                                }</span>
                                <button class="increase-quantity text-gray-500 hover:text-pink-600" data-id="${
                                  item.id
                                }">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                        </div>
                        <button class="remove-item text-gray-400 hover:text-red-500 ml-2" data-id="${
                          item.id
                        }">
                            <i class="fas fa-times"></i>
                        </button>
                    `;

        cartItemsContainer.appendChild(cartItem);
      });

      cartSubtotal.textContent = subtotal.toFixed(2) + "€";
      cartTotal.textContent = subtotal.toFixed(2) + "€";
      cartSummary.classList.remove("hidden");
    }
  }

  // Add to cart
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const image = this.getAttribute("data-image");

      const existingItem = cart.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          image,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      updateCartSidebar();

      // Show cart sidebar when adding an item
      cartSidebar.classList.remove("translate-x-full");
      cartOverlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  });

  // Cart sidebar toggle
  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    updateCartSidebar();
  });

  closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // Handle cart item quantity changes and removal
  document.addEventListener("click", function (e) {
    // Decrease quantity
    if (
      e.target.classList.contains("decrease-quantity") ||
      e.target.closest(".decrease-quantity")
    ) {
      const button = e.target.classList.contains("decrease-quantity")
        ? e.target
        : e.target.closest(".decrease-quantity");
      const id = button.getAttribute("data-id");
      const item = cart.find((item) => item.id === id);

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter((item) => item.id !== id);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      updateCartSidebar();
    }

    // Increase quantity
    if (
      e.target.classList.contains("increase-quantity") ||
      e.target.closest(".increase-quantity")
    ) {
      const button = e.target.classList.contains("increase-quantity")
        ? e.target
        : e.target.closest(".increase-quantity");
      const id = button.getAttribute("data-id");
      const item = cart.find((item) => item.id === id);

      item.quantity += 1;

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      updateCartSidebar();
    }

    // Remove item
    if (
      e.target.classList.contains("remove-item") ||
      e.target.closest(".remove-item")
    ) {
      const button = e.target.classList.contains("remove-item")
        ? e.target
        : e.target.closest(".remove-item");
      const id = button.getAttribute("data-id");

      cart = cart.filter((item) => item.id !== id);

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      updateCartSidebar();
    }
  });

  // Initialize cart on page load
  updateCartCount();
});
