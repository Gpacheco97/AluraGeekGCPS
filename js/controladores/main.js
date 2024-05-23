import {servicesProducts} from "../servicio/product.js"


// Función para actualizar un producto en el DOM
function updateProduct(product) {
    const productElement = productContainer.querySelector(`[data-id="${product.id}"]`);
    if (productElement) {
      productElement.innerHTML = createCard(product.name, product.price, product.image, product.id);
    } else {
      productContainer.appendChild(createCard(product.name, product.price, product.image, product.id));
    }
  }
  
  // Captura los datos del formulario
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-image]").value;
  
    try {
      const newProduct = await servicesProducts.sendProduct(name, price, image);
      updateProduct(newProduct);
      // Limpiar los campos del formulario
      document.querySelector("[data-name]").value = "";
      document.querySelector("[data-price]").value = "";
      document.querySelector("[data-image]").value = "";
    } catch (err) {
      console.log(err);
      // Mostrar mensaje de error al usuario
      showErrorMessage("No se pudo agregar el producto");
    }
  });
  
  // Captura el clic en el botón de eliminar
  productContainer.addEventListener("click", async (event) => {
    event.preventDefault();
    
    // Verifica si el elemento clickeado es el ícono de eliminar
    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) {
      const itemId = removeButton.dataset.id;
      try {
        await servicesProducts.deleteProduct(itemId);
        // Eliminar el producto del DOM
        const productElement = productContainer.querySelector(`[data-id="${itemId}"]`);
        productElement.remove();
      } catch (err) {
        console.log(err);

        // Mostrar mensaje de error al usuario
        showErrorMessage("No se pudo eliminar el producto");
      }
    }
  });
  
  // Función para mostrar un mensaje de error
  function showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = message;
    productContainer.appendChild(errorDiv);

    // Ocultar el mensaje de error después de 3 segundos
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }