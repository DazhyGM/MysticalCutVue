<template>
  <div class="container-scaled-wrapper">
    <div class ="row mb-2">
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Productos</h1>
      </ul>
    </div>
    <div class="container">

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
import { getProducts, updateProductStatus } from "@/services/productsApi";
import { addToCartAPI, getCartAPI, updateCartItemAPI } from "@/services/shoppingCartApi";
import axios from 'axios';
import '@/assets/css/products.css';

const router = useRouter();
const products = ref([]);
const user = ref(JSON.parse(localStorage.getItem("user")));
const roleModules = ref(JSON.parse(localStorage.getItem("roleModules")) || []);
const userRole = ref('');


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

