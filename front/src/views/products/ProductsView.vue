<template>
  <div class="container-scaled-wrapper">
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
          <h1>Productos</h1>
        </ul>
      </header>

      <div class="d-flex justify-content-between my-3" v-if="userRole === 'Admin'">
        <router-link to="/Create-Products" class="btn btn-agregar">
          <img src="/img/logos/person-plus-fill.svg" style="width: 20px; height: 20px; margin-right: 5px;" />
          Agregar
        </router-link>

        <router-link to="/ProductsInactives" class="btn btn-botonavinactive">
          Ver productos inactivos
        </router-link>
      </div>

      

      <div class="product-grid">
        <div class="product-card" v-for="product in products" :key="product.id_product">
          <img :src="getImageUrl(product.image)" alt="Imagen del producto" class="product-img" />
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">${{ product.price.toLocaleString() }}</p>
          <p class="product-amount"><strong>Disponibles:</strong> {{ product.amount }}</p>

          <div class="card-actions">
            <label class="switch" v-if="userRole === 'Admin'">
              <input
                type="checkbox"
                :checked="product.id_status === 1"
                @change="() => toggleSwitch(product)"
              />
              <span class="slider round" :class="{ blocked: product.id_status === 2, active: product.id_status === 1 }"></span>
            </label>

            <button class="btn-buy" @click="() => viewProductDetails(product)">Ver</button>
            <button class="btn-edit" @click="() => editProduct(product.id_product)" v-if="userRole === 'Admin'">Editar</button>
            <button class="btn-delete" @click="() => confirmInactivate(product.id_product)" v-if="userRole === 'Admin'">Eliminar</button>
          </div>
        </div>
      </div>

      <div class="btn-regresar mt-3">
        <button class="btn back-button" @click="goBack">Regresar</button>
      </div>

      <FooterComponent />
    </div>
  </div>
  
  <div v-if="showSidebar && userRole === 'Client'" class="cart-add-box">
    <div class="cart-header-strip">
      <h4 class="mb-0">Productos para agregar al carrito</h4>
      <div class="cart-actions-strip">
        <button
          class="btn btn-success"
          @click="confirmAddToCart"
          :disabled="!isConfirmButtonEnabled"
        >
          Confirmar y Añadir Todos
        </button>
        <button class="close-btn-strip" @click="clearPendingCartAndClose">X</button>
      </div>
    </div>
    <div class="cart-content-strip">
      <div v-if="pendingCartItems.length === 0" class="empty-cart-message">
        No hay productos seleccionados.
      </div>
      <div v-else class="pending-items-wrapper">
        <div v-for="(item, index) in pendingCartItems" :key="item.id_product" class="pending-item-strip">
          <div class="product-info-strip-item">
            <img :src="getImageUrl(item.image)" class="cart-img-strip" />
            <div>
              <h3>{{ item.name }}</h3>
              <p><strong>Precio:</strong> ${{ item.price.toLocaleString() }}</p>
              <p><strong>Disponibles:</strong> {{ item.amount }}</p>
            </div>
          </div>
          <div class="quantity-control-strip-item">
            <label :for="`quantity-${item.id_product}`">Cantidad:</label>
            <input
              :id="`quantity-${item.id_product}`"
              type="number"
              v-model.number="item.quantity"
              :min="1"
              :max="item.amount"
              class="form-control"
            />
            <p v-if="item.quantity > item.amount" class="error-message">
              No puedes seleccionar más de {{ item.amount }} unidades
            </p>
            <p v-if="item.quantity <= 0" class="error-message">
              La cantidad debe ser al menos 1.
            </p>
          </div>
          <button class="btn-remove-pending-strip" @click="() => removePendingItem(index)">Eliminar</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showProductModal" class="modal-overlay" @click.self="showProductModal = false">
    <div class="modal-content">
      <button class="close-modal-btn" @click="showProductModal = false">X</button>
      <h2 class="modal-title">{{ selectedProduct.name }}</h2>
      <img :src="getImageUrl(selectedProduct.image)" alt="Imagen del producto" class="modal-product-img" />
      <p class="modal-description"><strong>Descripción:</strong> {{ selectedProduct.description }}</p>
      <p class="modal-price"><strong>Precio:</strong> ${{ selectedProduct.price.toLocaleString() }}</p>
      <p class="modal-amount"><strong>Disponibles:</strong> {{ selectedProduct.amount }}</p>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import FooterComponent from "@/components/layout/FooterComponent.vue";
import { getProducts, updateProductStatus } from "@/services/productsApi";
import { addToCartAPI, getCartAPI, updateCartItemAPI } from "@/services/shoppingCartApi";
import axios from 'axios';

const router = useRouter();
const products = ref([]);
const user = ref(JSON.parse(localStorage.getItem("user")));
const roleModules = ref(JSON.parse(localStorage.getItem("roleModules")) || []);
const userRole = ref('');

const isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const logout = () => {
  localStorage.clear();
  router.push("/");
};
const goToProfile = () => router.push("/perfil");
const goBack = () => router.push("/Home");

const getImageUrl = (imageName) => `http://localhost:5000/uploads/${imageName}`;



const loadProducts = async () => {
  products.value = await getProducts();
};

const fetchUserRole = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      userRole.value = '';
      return;
    }
    const { data } = await axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    userRole.value = data.role;
    user.value = {
      full_name: data.full_name || 'Usuario',
      user_id: data.user_id,
      user_email: data.user_email || '',
      modules: data.modules || [],
      role: data.role
    };
    localStorage.setItem("user", JSON.stringify(user.value));
    roleModules.value = data.modules || [];
    localStorage.setItem("roleModules", JSON.stringify(roleModules.value));
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    userRole.value = '';
  }
};

const toggleSwitch = async (product) => {
  const newStatus = product.id_status === 1 ? 2 : 1;
  const action = newStatus === 1 ? "activo" : "agotado";

  const confirmed = confirm(`¿Estás seguro que deseas poner este producto en estado ${action}?`);
  if (!confirmed) {
    await loadProducts();
    return;
  }

  await updateProductStatus(product.id_product, newStatus);
  await loadProducts();
};

const confirmInactivate = async (id_product) => {
  const confirmDelete = confirm("¿Estás seguro que deseas eliminar (inactivar) este producto?");
  if (!confirmDelete) return;

  await updateProductStatus(id_product, 3);
  await loadProducts();
};

const editProduct = (id) => {
  router.push(`/Edit-Products/${id}`);
};

const showSidebar = ref(false);
const pendingCartItems = ref([]);

const isConfirmButtonEnabled = computed(() => {
  if (pendingCartItems.value.length === 0) return false;
  return pendingCartItems.value.every(item => item.quantity > 0 && item.quantity <= item.amount);
});

const removePendingItem = (index) => {
  pendingCartItems.value.splice(index, 1);
  if (pendingCartItems.value.length === 0) {
    showSidebar.value = false;
  }
};

const clearPendingCartAndClose = () => {
  pendingCartItems.value = [];
  showSidebar.value = false;
};

const confirmAddToCart = async () => {
  if (pendingCartItems.value.length === 0) {
    alert("No hay productos seleccionados para agregar al carrito.");
    return;
  }

  const user_id = getUserIdFromToken();
  if (!user_id) {
    alert("No se pudo obtener el ID del usuario.");
    return;
  }

  let allProductsSuccessfullyAdded = true;
  for (const pendingItem of pendingCartItems.value) {
    if (pendingItem.quantity <= 0 || pendingItem.quantity > pendingItem.amount) {
      alert(`Error: Cantidad inválida (${pendingItem.quantity}) para "${pendingItem.name}". Por favor, ajusta la cantidad.`);
      allProductsSuccessfullyAdded = false;
      continue;
    }

    try {
      const cartResponse = await getCartAPI(user_id);
      const currentCart = cartResponse.data?.items || [];
      const existingItemInBackendCart = currentCart.find(item => item.id_product === pendingItem.id_product);

      if (existingItemInBackendCart) {
        const newAmount = existingItemInBackendCart.amount + pendingItem.quantity;
        if (newAmount > pendingItem.amount) {
          alert(`Advertencia: No se pueden agregar ${pendingItem.quantity} unidades de "${pendingItem.name}". Solo hay ${pendingItem.amount - existingItemInBackendCart.amount} disponibles adicionales.`);
          allProductsSuccessfullyAdded = false;
          continue;
        }
        await updateCartItemAPI(existingItemInBackendCart.id_cart, newAmount);
      } else {
        const cartItem = {
          user_id,
          id_product: pendingItem.id_product,
          amount: pendingItem.quantity,
        };
        await addToCartAPI(cartItem);
      }
    } catch (error) {
      console.error(`Error al procesar "${pendingItem.name}" para el carrito:`, error);
      alert(`Error al agregar "${pendingItem.name}" al carrito. Por favor, inténtalo de nuevo.`);
      allProductsSuccessfullyAdded = false;
      continue;
    }
  }

  if (allProductsSuccessfullyAdded) {
    alert("Todos los productos seleccionados fueron agregados/actualizados en el carrito.");
    pendingCartItems.value = [];
    showSidebar.value = false;
    router.push("/Cart");
  } else {
    alert("Algunos productos no pudieron ser agregados/actualizados. Por favor, revisa las cantidades y disponibilidad.");
  }
};


// Modal functionality
const showProductModal = ref(false);
const selectedProduct = ref(null);

const viewProductDetails = (product) => {
  selectedProduct.value = product;
  showProductModal.value = true;
};

onMounted(() => {
  fetchUserRole();
  loadProducts();
});

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
</script>

<style scoped>
/* Existing styles (unchanged) */
.container-scaled-wrapper {
  transform: scale(0.9);
  transform-origin: top center;
  width: 100%;
  overflow-x: hidden;
}

.container {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding: 1rem;
}

.d-flex {
  display: flex;
  width: 100%;
}

.d-flex.justify-content-center {
  justify-content: center;
}

.btn-botonavinactive {
  background-color: #d4af37;
  color: black;
  border: 1px solid;
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-botonavinactive:hover {
  background-color: #b28f2f;
}

.btn-agregar {
  background-color: #d4af37;
  color: black;
  border: none;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-agregar:hover {
  background-color: #b28f2f;
}

.btn-vercarrito {
  background-color: #d4af37;
  color: black;
  border: 1px solid;
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 1rem;
}

.btn-vercarrito:hover {
  background-color: #b28f2f;
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
  min-height: 10px;
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
  color: #eee;
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

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin: 0 auto;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #df0000;
  border-radius: 20px;
  transition: 0.4s;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  border-radius: 50%;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
}

input:checked+.slider {
  background-color: #4caf50;
}

input:checked+.slider.blocked {
  background-color: red !important;
}

input:checked+.slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 20px;
}


.btn-view {
  background-color: #3498db; 
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-view:hover {
  background-color: #2980b9;
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


.cart-add-box {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: #1a1a1a;
  border-top: 1px solid #d4af37;
  padding: 1rem 1.5rem;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: white;
}

.cart-header-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;
}

.cart-actions-strip {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  align-items: center;
  width: 100%;
  gap: 1rem;
  max-height: 250px;
  overflow-y: auto;
  padding-bottom: 1rem;
}

.empty-cart-message {
  padding: 1rem;
  color: #ccc;
  font-style: italic;
  text-align: center;
}

.pending-items-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
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

.btn-remove-pending-strip {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 1rem;
  flex-shrink: 0;
}

.btn-remove-pending-strip:hover {
  background-color: #c9302c;
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
  width: auto;
  max-width: none;
  margin-top: 0;
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

@media (min-width: 768px) {
  .cart-add-box {
    padding: 0.8rem 2rem;
  }

  .cart-content-strip {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    max-height: 180px;
  }

  .pending-items-wrapper {
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: hidden;
    overflow-y: auto;
    justify-content: flex-start;
    padding-bottom: 0px;
    width: 100%;
  }

  .pending-item-strip {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-width: unset;
    flex-shrink: 0;
    width: 100%;
  }

  .product-info-strip-item {
    text-align: left;
  }

  .quantity-control-strip-item {
    flex-direction: row;
    gap: 0.8rem;
    width: auto;
  }

  .btn-remove-pending-strip {
    margin-left: 0.5rem;
  }

  .btn-success {
    width: auto;
    max-width: none;
    margin-top: 0;
  }
}

@media (max-width: 576px) {
  .cart-add-box {
    padding: 0.8rem 1rem;
  }

  .cart-header-strip {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
  }

  .cart-actions-strip {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

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

  .btn-remove-pending-strip {
    margin-top: 0.5rem;
    margin-left: 0;
  }

  .btn-success {
    width: 100%;
    max-width: 250px;
    margin-top: 0.5rem;
  }
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; 
}

.modal-content {
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-modal-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #d4af37;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
}

.close-modal-btn:hover {
  color: #fff;
}

.modal-title {
  font-size: 1.8rem;
  color: #d4af37;
  margin-bottom: 1rem;
}

.modal-product-img {
  max-width: 80%;
  height: auto;
  max-height: 250px;
  object-fit: contain;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border: 1px solid #333;
}

.modal-description,
.modal-price,
.modal-amount {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: #ccc;
  width: 100%; 
  text-align: left; 
}

.modal-price strong,
.modal-amount strong,
.modal-description strong {
  color: #d4af37; 
}
</style>