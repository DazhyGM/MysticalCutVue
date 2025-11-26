<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" />
        </router-link>
      </div>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li v-for="module in roleModules" :key="module.module_route" class="nav-item">
          <router-link class="nav-link" :to="`/${module.module_route}`">{{ module.role_module }}</router-link>
        </li>
      </ul>
      <div class="col-md-3 text-end">
        <div class="dropdown">
          <button class="btn dropdown-toggle" @click="toggleMenu">
            <img src="/img/background/Icono usuario.png" alt="Profile" class="icon me-2" />
            {{ user?.full_name || 'Usuario' }}
          </button>
          <ul v-if="isMenuOpen" class="dropdown-menu dropdown-menu-end show">
            <li><button class="dropdown-item" @click="goToProfile">Perfil</button></li>
            <li><hr class="dropdown-divider" /></li>
            <li><button class="dropdown-item" @click="logout">Cerrar Sesión</button></li>
          </ul>
        </div>
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Mi Carrito</h1>
      </ul>
    </header>

    <div v-if="products.length === 0" class="empty-cart-message">
      <p>Tu carrito está vacío. ¡Agrega algunos productos!</p>
    </div>
    <div class="product-grid">
      <div class="product-card" v-for="product in products" :key="product.id_product">
        <img :src="getImageUrl(product.image)" alt="Imagen del producto" class="product-img" />
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">${{ product.price.toLocaleString() }}</p>
        <p class="product-amount"><strong>Disponibles:</strong> {{ product.amount }}</p>

        <p class="product-in-cart">
          <img src="/img/logos/cart-check-fill.svg" style="width: 16px; height: 16px; margin-right: 5px;" alt="En Carrito"/>
          Cantidad en tu carrito: {{ product.quantityInCart }} unidades
        </p>

        <div class="card-actions">
          <button class="btn-delete" @click="() => removeFromCart(product.id_product)">Quitar del carrito</button>
          <button class="btn-cart" @click="() => addToCart(product)">Ajustar Cantidad</button> 
          <button class="btn-buy" @click="() => buyNow(product)">Comprar Ahora</button>
        </div>
      </div>
    </div>

    <div class="btn-regresar mt-3">
      <button class="btn back-button" @click="goBack">Continuar Comprando</button>
    </div>

    <div v-if="showSidebar" class="cart-add-box cart-adjust-box-bottom">
      <div class="cart-header-strip">
        <h4 class="mb-0">Ajustar Cantidad</h4>
        <button class="close-btn-strip" @click="() => (showSidebar = false)">X</button>
      </div>
      <div class="cart-content-strip" v-if="selectedProduct">
        <div class="pending-item-strip">
          <div class="product-info-strip-item">
            <img :src="getImageUrl(selectedProduct.image)" class="cart-img-strip" />
            <div>
              <h3>{{ selectedProduct.name }}</h3>
              <p><strong>Precio:</strong> ${{ selectedProduct.price.toLocaleString() }}</p>
              <p><strong>Disponibles:</strong> {{ selectedProduct.amount }}</p>
            </div>
          </div>
          <div class="quantity-control-strip-item">
            <label :for="`quantity-${selectedProduct.id_product}`">Cantidad:</label>
            <input
              :id="`quantity-${selectedProduct.id_product}`"
              type="number"
              v-model.number="quantity"
              :min="0"
              :max="selectedProduct.amount"
              class="form-control"
            />
            <p v-if="quantity > selectedProduct.amount" class="error-message">
              No puedes seleccionar más de {{ selectedProduct.amount }} unidades
            </p>
            <p v-if="quantity < 0" class="error-message">
              La cantidad no puede ser negativa.
            </p>
          </div>
        </div>
        <button
          class="btn btn-success mt-3"
          @click="confirmAddToCart"
          :disabled="quantity < 0 || quantity > selectedProduct.amount"
        >
          Actualizar Carrito
        </button>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import FooterComponent from "./FooterComponent.vue";
import { getProducts } from "../services/productsApi"; 
import { getCartAPI, updateCartItemAPI, removeFromCartAPI } from "../services/shoppingCartApi";

const router = useRouter();
const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));
const roleModules = JSON.parse(localStorage.getItem("roleModules")) || [];

const isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const logout = () => {
  localStorage.clear();
  router.push("/");
};
const goToProfile = () => router.push("/perfil");
const goBack = () => router.push("/Products"); 

const getImageUrl = (imageName) => `http://localhost:5000/uploads/${imageName}`;

const loadProducts = async () => {
  try {
    const allProducts = await getProducts(); 
    const userId = getUserIdFromToken();
    let userCartItems = [];

    if (!userId) {
      alert("No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.");
      router.push("/");
      return;
    }

    try {
      const cartResponse = await getCartAPI(userId);
      userCartItems = cartResponse.data?.items || [];
      console.log("Carrito del usuario cargado:", userCartItems);
    } catch (error) {
      console.error("Error al cargar el carrito del usuario:", error);
      alert('No se pudo cargar el carrito. Intenta de nuevo más tarde.');
      products.value = [];
      return;
    }

    products.value = userCartItems.map(cartItem => {
      const productDetail = allProducts.find(p => p.id_product === cartItem.id_product);
      if (productDetail) {
        return {
          ...productDetail,
          quantityInCart: cartItem.amount,
          id_cart_item: cartItem.id_cart 
        };
      }
      return null;
    }).filter(p => p !== null); 
    
  } catch (error) {
    console.error("Error al cargar productos del carrito:", error);
    alert('Hubo un problema al cargar los productos de tu carrito. Por favor, intenta de nuevo.');
  }
};

// Franja para ajustar cantidad
const showSidebar = ref(false); 
const selectedProduct = ref(null);
const quantity = ref(1);

const addToCart = (product) => { 
  selectedProduct.value = product;
  quantity.value = product.quantityInCart; 
  showSidebar.value = true;
};

const confirmAddToCart = async () => {
  if (!selectedProduct.value || quantity.value < 0 || quantity.value > selectedProduct.value.amount) {
    alert("Cantidad inválida o excede el stock disponible.");
    return;
  }

  const user_id = getUserIdFromToken();
  if (!user_id) {
    alert("No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.");
    return;
  }

  try {
    if (quantity.value === 0) {
        await removeFromCart(selectedProduct.value.id_product);
        showSidebar.value = false; 
        return; 
    }

    await updateCartItemAPI(selectedProduct.value.id_cart_item, quantity.value); 
    alert("Cantidad del producto actualizada en el carrito.");
    
    showSidebar.value = false; 
    await loadProducts(); 
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    alert("Error al actualizar el carrito: " + error.message); 
  }
};

const removeFromCart = async (id_product_to_remove) => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este producto del carrito?");
    if (!confirmed) return;

    const userId = getUserIdFromToken();
    if (!userId) {
        alert("No se pudo obtener el ID del usuario.");
        return;
    }

    try {
        const itemToRemove = products.value.find(p => p.id_product === id_product_to_remove);
        if (itemToRemove && itemToRemove.id_cart_item) {
            await removeFromCartAPI(itemToRemove.id_cart_item);
            alert("Producto eliminado del carrito.");
            await loadProducts(); 
        } else {
            alert("Error: No se encontró el ID del item del carrito para eliminar.");
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        alert("Error al eliminar producto del carrito: " + error.message);
    }
};

const buyNow = (product) => {
  alert(`Has iniciado el proceso de compra para "${product.name}". Esto iniciaría el checkout.`);
};

onMounted(loadProducts);

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.id;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}
</script>

<style scoped>
/* Tus estilos existentes aquí */
.container {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-start;
  margin: 1rem 2rem;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem auto;
  padding: 0 1rem;
  max-width: 1200px;
}

.product-card {
  background-color: #1c1c1c;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 560px;
  position: relative;
}

.product-img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #d4af37;
}

.product-description {
  font-size: 0.95rem;
  color: #ccc;
  margin: 0.4rem 0;
}

.product-price {
  font-size: 1rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.8rem;
}

.product-amount {
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.product-in-cart {
  font-size: 0.9rem;
  color: #4CAF50;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.8rem;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #333;
}

.btn-edit,
.btn-delete {
  background-color: #d4af37;
  color: black;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-delete {
  background-color: #d9534f;
  color: white;
}

.btn-edit:hover {
  background-color: #b28f2f;
}

.btn-delete:hover {
  background-color: #c9302c;
}

.btn-cart,
.btn-buy {
  background-color: #2d2d2d;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-cart:hover,
.btn-buy:hover {
  background-color: #d4af37;
  color: black;
}

.btn-regresar {
  margin-top: 1rem;
  text-align: center;
}

.back-button {
  background-color: #d4af37;
  color: black;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.back-button:hover {
  background-color: #b28f2f;
}


.cart-adjust-box-bottom { 
  position: fixed; 
  bottom: 0; 
  left: 0; 
  width: 100%; 
  background-color: #1a1a1a;
  border-top: 1px solid #d4af37; 
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.5); 
  z-index: 1050;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  color: white;
  max-height: 250px; 
  overflow-y: auto; 
}

.cart-header-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;
  margin-bottom: 1rem;
}

.close-btn-strip {
  background: none;
  border: none;
  color: #d4af37;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.cart-content-strip {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding-bottom: 1rem;
}

.pending-item-strip {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 0.8rem;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  position: relative;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-info-strip-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
  min-width: 150px;
}

.cart-img-strip {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 5px;
  background-color: #333;
  flex-shrink: 0;
}

.product-info-strip-item h3 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  color: #d4af37;
}

.product-info-strip-item p {
  font-size: 0.9rem;
  margin-bottom: 0;
  color: #ccc;
}

.quantity-control-strip-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.form-control {
  background-color: #222;
  color: #fff;
  border: 1px solid #d4af37;
  border-radius: 5px;
  padding: 0.4rem 0.6rem;
  width: 80px;
  font-size: 1rem;
  text-align: center;
}

.btn-success {
  background-color: #4caf50;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
  width: 100%;
  margin-top: 1rem;
}

.btn-success:hover {
  background-color: #45a049;
}

.btn-success:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 5px;
  text-align: center;
  width: 100%;
}

.empty-cart-message {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #ccc;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .cart-adjust-box-bottom {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .pending-item-strip {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .product-info-strip-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .quantity-control-strip-item {
    justify-content: center;
    width: 100%;
  }
}
</style>