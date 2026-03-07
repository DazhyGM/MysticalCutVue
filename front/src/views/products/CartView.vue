<template>
  <div class="container-cart">
    <div v-if="products.length === 0" class="empty-cart-message">
      <p>Tu carrito está vacío. ¡Agrega algunos productos!</p>
    </div>
    <div class="product-grid-cart">
      <div class="product-card" v-for="product in products" :key="product.id_product">
        <img :src="getImageUrl(product.image)" alt="Imagen del producto" class="product-img-cart" />
        <h2 class="product-name-cart">{{ product.name }}</h2>
        <p class="product-description-cart">{{ product.description }}</p>
        <p class="product-price-cart">${{ product.price.toLocaleString() }}</p>
        <p class="product-amount-cart"><strong>Disponibles:</strong> {{ product.amount }}</p>

        <p class="product-in-cart">
          <img src="/img/logos/cart-check-fill.svg" style="width: 16px; height: 16px; margin-right: 5px;"
            alt="En Carrito" />
          Cantidad en tu carrito: {{ product.quantityInCart }} unidades
        </p>

        <div class="card-actions">
          <button class="btn-delete" @click="() => removeFromCart(product.id_product)">Quitar del carrito</button>
          <button class="btn-cart" @click="() => addToCart(product)">Ajustar Cantidad</button>
          <button class="btn-buy" @click="() => buyNow(product)">Comprar Ahora</button>
        </div>
      </div>
    </div>

    <div>
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
            <input :id="`quantity-${selectedProduct.id_product}`" type="number" v-model.number="quantity" :min="0"
              :max="selectedProduct.amount" class="form-control" />
            <p v-if="quantity > selectedProduct.amount" class="error-message">
              No puedes seleccionar más de {{ selectedProduct.amount }} unidades
            </p>
            <p v-if="quantity < 0" class="error-message">
              La cantidad no puede ser negativa.
            </p>
          </div>
        </div>
        <button class="btn btn-success mt-3" @click="confirmAddToCart"
          :disabled="quantity < 0 || quantity > selectedProduct.amount">
          Actualizar Carrito
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProducts } from "@/services/productsApi";
import { getCartAPI, updateCartItemAPI, removeFromCartAPI } from "@/services/shoppingCartApi";

const router = useRouter();
const products = ref([]);

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
@import "@/assets/css/products/cartView.css";
</style>