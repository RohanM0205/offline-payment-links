document.addEventListener('DOMContentLoaded', function () {
    const fetchBtn = document.querySelector('.fetch-btn');
    const pincodeInput = document.getElementById('pincode');
    const localityInput = document.getElementById('locality');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');

    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.setAttribute('autocomplete', 'off');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('spellcheck', 'false');
    });

    fetchBtn.addEventListener('click', function () {
        const pinCode = pincodeInput.value.trim();

        // Basic Validation
        if (!/^\d{6}$/.test(pinCode)) {
            alert("Please enter a valid 6-digit pin code.");
            return;
        }

        // Disable button and show loading
        fetchBtn.disabled = true;
        fetchBtn.textContent = "Fetching...";

        fetch(`/PaymentForm/GetLocationByPinCode/${pinCode}`)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => null);
                    throw new Error(errorData?.message || "Failed to fetch pin code info.");
                }
                return res.json();
            })
            .then((data) => {
                localityInput.value = data.locality || "";
                cityInput.value = data.city || "";
                stateInput.value = data.state || "";
            })
            .catch((err) => {
                console.error(err);
                alert(err.message || "Error occurred while fetching pin code data.");
            })
            .finally(() => {
                fetchBtn.disabled = false;
                fetchBtn.textContent = "Fetch";
            });
    });

});


