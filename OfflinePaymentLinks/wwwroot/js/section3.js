document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("requestor-email");
    const addBtn = document.querySelector(".add-btn");
    const emailListField = document.getElementById("requestor-emails-list");

    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.setAttribute('autocomplete', 'off');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('spellcheck', 'false');
    });

    let emailList = [];
    let errorShown = false;
    // Disable browser autofill
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.setAttribute('autocomplete', 'off');
    });

    // Create and insert error element if not already present
    let errorElement = document.getElementById("requestorEmailError");
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.id = "requestorEmailError";
        errorElement.className = "error-message";
        errorElement.style.display = "none";
        emailInput.parentNode.parentNode.appendChild(errorElement);
    }

    // Add button click
    addBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent document click

        const email = emailInput.value.trim().toLowerCase();
        hideError(false); // just reset UI first

        if (!isValidEmail(email)) {
            showError("Please enter a valid email address.");
            return;
        }

        if (emailList.length >= 5) {
            showError("You can only add up to 5 email addresses.");
            return;
        }

        if (emailList.includes(email)) {
            showError("This email is already added.");
            return;
        }

        emailList.push(email);
        emailListField.value = emailList.join(", ");
        emailInput.value = "";
    });

    // Error hide and input clear on focusout
    emailInput.addEventListener("blur", () => {
        if (errorShown) {
            hideError(true); // also clears input
        }
    });

    // Hide on input
    emailInput.addEventListener("input", () => {
        hideError(false);
    });

    // Hide error on clicking anywhere outside
    document.addEventListener("click", () => {
        if (errorShown) {
            hideError(true);
        }
    });

    // Prevent document click from interfering when clicking inside input
    emailInput.addEventListener("click", e => e.stopPropagation());
    addBtn.addEventListener("click", e => e.stopPropagation());

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorShown = true;
    }

    function hideError(clearInput = false) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
        errorShown = false;

        if (clearInput) {
            emailInput.value = "";
        }
    }

    // Disable browser autofill
    
});
