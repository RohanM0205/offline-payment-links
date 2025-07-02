document.addEventListener('DOMContentLoaded', function () {
    console.log("section1.js loaded");

    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.setAttribute('autocomplete', 'off');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('spellcheck', 'false');
    });
    // DOM Elements
    
    const transType = document.getElementById('transType');
    const channelType = document.querySelectorAll('input[name="channelType"]');
    const customerType = document.querySelectorAll('input[name="customerType"]');
    const kycIdGroup = document.getElementById('kycIdGroup');
    const policySearchGroup = document.getElementById('policySearchGroup');
    const shortfallSearchGroup = document.getElementById('shortfallSearchGroup');
    const searchType = document.getElementById('searchType');
    const shortfallFieldLabel = document.getElementById('shortfallFieldLabel');
    const verifyBtn = document.getElementById('verifyBtn');
    const searchBtn = document.getElementById('searchBtn');
    const findBtn = document.getElementById('findBtn');

    // Error placeholders
    const kycIdError = createErrorElement('kycIdError', 'Please enter KYC ID');
    const policyNumberError = createErrorElement('policyNumberError', 'Please enter Policy Number');
    const shortfallFieldError = createErrorElement('shortfallFieldError', 'Please enter search value');
    const channelTypeError = createErrorElement('channelTypeError', 'Please select Channel Type');
    const customerTypeError = createErrorElement('customerTypeError', 'Please select Customer Type');

    document.getElementById('kycIdGroup').appendChild(kycIdError);
    document.getElementById('policySearchGroup').appendChild(policyNumberError);
    document.getElementById('shortfallSearchGroup').appendChild(shortfallFieldError);

    const formGroups = document.querySelectorAll('.form-group-row .form-group');
    if (formGroups.length >= 2) {
        formGroups[0].appendChild(channelTypeError);   // Channel Type
        formGroups[1].appendChild(customerTypeError);  // Customer Type
    }

    // Disable browser autofill
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.setAttribute('autocomplete', 'off');
    });

    toggleFields();

    // Event Listeners
    transType.addEventListener('change', toggleFields);
    searchType.addEventListener('change', updateShortfallFieldLabel);
    verifyBtn.addEventListener('click', handleVerify);
    searchBtn.addEventListener('click', handleSearch);
    findBtn.addEventListener('click', handleFind);
    

    channelType.forEach(radio => {
        radio.addEventListener('change', () => channelTypeError.style.display = 'none');
    });

    customerType.forEach(radio => {
        radio.addEventListener('change', () => {
            customerTypeError.style.display = 'none';

            const genderInputs = document.querySelectorAll('input[name="gender"]');
            const salutationSelect = document.getElementById('salutation');

            if (radio.checked && radio.value === 'Corporate') {
                // Set gender to Corporate
                genderInputs.forEach(g => g.checked = (g.value === 'Corporate'));

                // Set salutation to Company
                if (salutationSelect) {
                    salutationSelect.value = 'Company';
                }
            } else if (radio.checked && radio.value === 'Individual') {
                // Clear gender
                genderInputs.forEach(g => g.checked = false);

                // Reset salutation to first option
                if (salutationSelect) {
                    salutationSelect.selectedIndex = 0;
                }
            }
        });
    });

    function toggleFields() {
        clearFormFields();
        clearErrors();
        const selectedValue = transType.value;

        kycIdGroup.style.display = 'none';
        policySearchGroup.style.display = 'none';
        shortfallSearchGroup.style.display = 'none';
        verifyBtn.style.display = 'none';
        searchBtn.style.display = 'none';
        findBtn.style.display = 'none';

        if (selectedValue === 'NB' || selectedValue === 'RL') {
            kycIdGroup.style.display = 'block';
            verifyBtn.style.display = 'inline-block';
        } else if (selectedValue === 'SF') {
            shortfallSearchGroup.style.display = 'block';
            findBtn.style.display = 'inline-block';
            updateShortfallFieldLabel();
        } else {
            // RO, EN, NCB => same as RO
            policySearchGroup.style.display = 'block';
            searchBtn.style.display = 'inline-block';
        }
    }

    function updateShortfallFieldLabel() {
        const selectedSearchType = searchType.value;
        const labelMap = {
            CustomerId: 'Customer Id',
            InwardNumber: 'Inward Number',
            InteractionId: 'Interaction Id'
        };
        const labelText = `Enter ${labelMap[selectedSearchType] || ''}`;
        shortfallFieldLabel.textContent = labelText;
        document.getElementById('shortfallFieldValue').placeholder = labelText;
    }

    function validateForm(forVerify = false) {
        console.log("validateForm called");
        let isValid = true;
        const selectedTransType = transType.value;
        const channelChecked = document.querySelector('input[name="channelType"]:checked');
        const customerChecked = document.querySelector('input[name="customerType"]:checked');

        channelTypeError.style.display = 'none';
        customerTypeError.style.display = 'none';

        if (!channelChecked) {
            channelTypeError.style.display = 'block';
            isValid = false;
        }

        if ((selectedTransType === 'NB' || selectedTransType === 'RL') && !customerChecked) {
            customerTypeError.style.display = 'block';
            isValid = false;
        }
        console.log(isValid);
        return isValid;
    }

    function handleVerify() {
        //console.log("verify button clicked");
        clearErrors();
        if (!validateForm(true)) return;
        clearAddressByPincode();

        const kycId = document.getElementById('kycId').value.trim();
        const errorDisplay = document.getElementById('errorDisplay');
        errorDisplay.textContent = '';
        errorDisplay.style.display = 'none';

        if (!kycId) {
            showError('Please enter KYC ID');
            return;
        }

        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Verifying...';

        fetch(`/PaymentForm/GetKycDetails/${encodeURIComponent(kycId)}`)
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => null);
                    throw new Error(errorData?.message || 'Verification failed');
                }
                return res.json();
            })
            .then(data => autofillKYC(data))
            .catch(error => showError(error.message))
            .finally(() => {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify';
            });
    }

    function handleSearch() {
        clearErrors();
        if (!validateForm()) return;
        clearAddressByPincode();

        const policyNumber = document.getElementById('policyNumber').value.trim();
        if (!policyNumber) {
            policyNumberError.style.display = 'block';
            return;
        }

        policyNumberError.style.display = 'none';

        fetch(`/PaymentForm/GetPolicyDetails/${encodeURIComponent(policyNumber)}`)
            .then(async res => {
                if (!res.ok) {
                    const error = await res.json().catch(() => null);
                    throw new Error(error?.message || "Error fetching policy details");
                }
                return res.json();
            })
            .then(data => autofillKYC(data))
            .catch(error => showError(error.message));
    }

    function handleFind() {
        clearErrors();
        if (!validateForm()) return;
        clearAddressByPincode();

        const value = document.getElementById('shortfallFieldValue').value.trim();
        const type = searchType.value;
        const queryParams = new URLSearchParams();

        if (!value) {
            shortfallFieldError.style.display = 'block';
            return;
        }

        shortfallFieldError.style.display = 'none';

        if (type === 'CustomerId') queryParams.append("customerId", value);
        else if (type === 'InwardNumber') queryParams.append("inwardNumber", value);
        else if (type === 'InteractionId') queryParams.append("interactionId", value);

        fetch(`/PaymentForm/ShortFallSearch?${queryParams.toString()}`)
            .then(async res => {
                if (!res.ok) {
                    const error = await res.json().catch(() => null);
                    throw new Error(error?.message || "Shortfall search failed");
                }
                return res.json();
            })
            .then(data => autofillKYC(data))
            .catch(error => showError(error.message));
    }

    function autofillKYC(data) {
        if (!data) return;

        // Fill common text fields (handles both naming styles)
        //console.log(Object.keys(data));
        const fields = {
            name: data.name,
            email: data.email ?? data.emailId,
            mobile: data.mobile ?? data.mobileNumber,
            address1: data.address1,
            address2: data.address2,
            pincode: data.pin_Code ?? data.pinCode,
            //city: data.city,
            //state: data.state,
            amount: data.amount
        };

        Object.entries(fields).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value || '';
        });

        // Handle gender
        const genderRaw = data.gender;
        if (genderRaw) {
            const gender = genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1).toLowerCase();
            const genderInput = document.querySelector(`input[name="gender"][value="${gender}"]`);
            if (genderInput) genderInput.checked = true;
        }

        // Handle salutation (from both KYC or Policy)
        const salutationValue = data.salutation;
        if (salutationValue) {
            const salutation = document.getElementById('salutation');
            if (salutation) {
                const normalized = salutationValue.trim();
                const validOptions = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Company'];
                salutation.value = validOptions.includes(normalized) ? normalized : '';
            }
        }
    }

    function showError(message) {
        const errorDisplay = document.getElementById('errorDisplay');
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
    }

    function createErrorElement(id, message) {
        const error = document.createElement('div');
        error.id = id;
        error.className = 'error-message';
        error.textContent = message;
        error.style.display = 'none';
        return error;
    }

    function clearErrors() {
        // Hide all error messages
        document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');

        // Also clear main error block
        const errorDisplay = document.getElementById('errorDisplay');
        if (errorDisplay) {
            errorDisplay.textContent = '';
            errorDisplay.style.display = 'none';
        }
    }

    function clearFormFields() {
        const inputIds = [
            "kycId", "policyNumber", "shortfallFieldValue", "name", "email", "mobile",
            "address1", "address2", "pincode", "locality", "city", "state",
            "requestor-mobile", "requestor-email", "requestor-emails-list", "amount", "remarks"
        ];

        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Clear gender
        document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);

        // Reset salutation and product dropdowns
        const salutation = document.getElementById('salutation');
        if (salutation) salutation.selectedIndex = 0;

        const product = document.getElementById('product');
        if (product) product.selectedIndex = 0;
    }

    function clearAddressByPincode() {
        const idsToClear = ["locality", "city", "state"];
        idsToClear.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }



});
