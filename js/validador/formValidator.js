import { errortypes, messages } from "../error/customError";

const formFields = document.querySelectorAll("[required]");
const form = document.querySelector("[data-form]");
const sendButton = document.getElementById("send");
const deleteButton = document.getElementById("delete");

// Función para mostrar mensajes de error
function showErrorMessage(field, message) {
    const errorMessage = field.parentNode.querySelector(".error-message");
    errorMessage.textContent = message;
}

// Función para validar un campo
function validateField(field) {
    const fieldName = field.getAttribute("name");
    let message = "";

    if (!field.value.trim()) {
        message = messages[fieldName].valueMissing || "Este campo es requerido.";
    } else if (fieldName === "name" && (field.value.length < 3 || field.value.length > 100)) {
        message = messages[fieldName].tooShort || "El nombre debe tener entre 3 y 100 caracteres.";
    } else if (field.type === "url" && !(isURLValid(field.value))) {
        message = messages[fieldName].typeMismatch || messages[fieldName].valueMissing;
    }

    showErrorMessage(field, message);
    return !message;
}

// Función para validar el formulario
function validateForm() {
    let firstErrorField = null;
    let formIsValid = true;

    for (const field of formFields) {
        if (!validateField(field)) {
            formIsValid = false;
            if (!firstErrorField) {
                firstErrorField = field;
            }
        }
    }

    if (!formIsValid && firstErrorField) {
        firstErrorField.focus();
    }

    return formIsValid;
}

// Evento de envío del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (validateForm()) {
        const listaRespuestas = {
            name: e.target.elements["name"].value,
            price: e.target.elements["price"].value,
            image: e.target.elements["image"].value
        };

        localStorage.setItem("registro", JSON.stringify(listaRespuestas));
        form.reset();
    }
});

// Evento de clic en el botón de envío
sendButton.addEventListener("click", (e) => {
    if (!validateForm()) {
        e.preventDefault();
    }
});

// Evento de clic en el botón de eliminación
deleteButton.addEventListener("click", () => {
    formFields.forEach((field) => {
        field.parentNode.querySelector(".error-message").textContent = "";
    });
    window.location.reload();
});

// Función para validar una URL
async function isURLValid(url) {
    try {
        const response = await fetch(url);
        return response.ok && response.headers.get("content-type").startsWith("image/");
    } catch {
        return false;
    }
}