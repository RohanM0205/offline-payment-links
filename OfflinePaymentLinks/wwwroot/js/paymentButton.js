//document.addEventListener('DOMContentLoaded', function () {
//    const paymentButton = document.querySelector('.btn-send-payment');
//    const form = document.querySelector('.allSections');
//    const resetBtn = document.querySelector('.btn-reset-form');
//    import { getSection4Files } from './section4.js';

//    document.querySelectorAll('input, textarea, select').forEach(el => {
//        el.setAttribute('autocomplete', 'off');
//        el.setAttribute('autocorrect', 'off');
//        el.setAttribute('spellcheck', 'false');
//    });

//    if (paymentButton && form) {
//        let isProcessing = false;

//        document.addEventListener('click', function (e) {
//            if (!e.target.closest('.btn-send-payment')) {
//                removeAllValidationErrors();
//            }
//        });

//        paymentButton.addEventListener('click', async function (e) {
//            e.preventDefault();

//            if (isProcessing) return;
//            isProcessing = true;
//            paymentButton.disabled = true;
//            paymentButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

//            try {
//                removeAllValidationErrors();

//                if (!validateRequiredFields()) return;

//                const transactionType = document.getElementById("transType").value;

//                const generateRes = await fetch('/PaymentForm/GenerateShortPaymentLink', {
//                    method: 'POST',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
//                    },
//                    body: JSON.stringify({ transactionType })
//                });

//                if (!generateRes.ok) throw new Error("Error generating payment link.");
//                const { jobRequestId, invoiceNo, paymentReferenceNo, shortUrl } = await generateRes.json();

//                const prePayData = collectFormData();
//                prePayData.JobRequestId = jobRequestId;
//                prePayData.InvoiceNo = invoiceNo;
//                prePayData.PaymentReferenceNo = paymentReferenceNo;
//                prePayData.PaymentLink = shortUrl;
//                prePayData.ShortUrl = shortUrl;
//                prePayData.UrlExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

//                // Upload Section 4 Files if visible and Stop AutoRenewal is selected
//                //const selectedOption = document.querySelector('input[name="autoRenewalOption"]:checked')?.value;
//                //const fileInput = document.getElementById('uploadFiles');

//                //if (selectedOption === 'StopAutoRenewal') {
//                //    if (!fileInput || fileInput.files.length === 0) {
//                //        throw new Error("Files are required for Stop AutoRenewal.");
//                //    }

//                //    const formData = new FormData();
//                //    formData.append("invoiceNumber", invoiceNo);

//                //    for (let file of fileInput.files) {
//                //        formData.append("files", file);
//                //    }

//                //    const uploadRes = await fetch('/PaymentForm/UploadAndZipFiles', {
//                //        method: 'POST',
//                //        body: formData
//                //    });

//                //    if (!uploadRes.ok) throw new Error("File upload failed.");

//                //    const uploadResult = await uploadRes.json();
//                //    prePayData.UploadedFilesPath = uploadResult.zipPath;
//                //}

//                //const transactionType = document.getElementById("transType").value;
//                //const prePayData = collectFormData();

//                // Handle AutoRenewal logic only if NOT 'NB' or 'RL'



//                if (transactionType !== 'NB' && transactionType !== 'RL') {
//                    const selectedOption = document.querySelector('input[name="autoRenewalOption"]:checked')?.value;

//                    if (!selectedOption) {
//                        throw new Error("Please select an Auto-Renewal option.");
//                    }

//                    const { selectedOption, files } = getSection4Files();
//                    if (selectedOption === 'StopAutoRenewal') {
//                        if (!files || files.length === 0) {
//                            throw new Error("Files are required for Stop AutoRenewal.");
//                        }

//                    // Assign isAutoRenewal based on selected radio-like checkbox
//                    //prePayData.isAutoRenewal = selectedOption === 'AutoRenewal';

//                    // If StopAutoRenewal, ensure file upload is handled
//                    //if (selectedOption === 'StopAutoRenewal') {
//                    //    const fileInput = document.getElementById('uploadFiles');
//                    //    if (!fileInput || fileInput.files.length === 0) {
//                    //        throw new Error("Files are required for Stop AutoRenewal.");
//                    //    }

//                        const formData = new FormData();
//                        formData.append("invoiceNumber", invoiceNo);
//                        files.forEach(file => {
//                            formData.append("files", file);
//                        });
//                        //for (let file of fileInput.files) {
//                        //    formData.append("files", file);
//                        //}

//                        const uploadRes = await fetch('/PaymentForm/UploadAndZipFiles', {
//                            method: 'POST',
//                            body: formData
//                        });

//                        if (!uploadRes.ok) throw new Error("File upload failed.");

//                        const uploadResult = await uploadRes.json();
//                        prePayData.UploadedFilesPath = uploadResult.zipPath;
//                    }
//                }


//                // Store isAutoRenewal flag from Section 4
//                if (selectedOption === 'AutoRenewal') {
//                    prePayData.isAutoRenewal = true;
//                } else if (selectedOption === 'StopAutoRenewal') {
//                    prePayData.isAutoRenewal = false;
//                }


//                sessionStorage.setItem('PrePaymentData', JSON.stringify(prePayData));

//                // Store session data
//                await fetch('/SendPaymentLink/StorePrePaymentData', {
//                    method: 'POST',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
//                    },
//                    body: JSON.stringify(prePayData)
//                });

//                // Redirect to new controller/view
//                window.location.href = '/SendPaymentLink';

//            } catch (err) {
//                console.error("Payment Error:", err);
//                showErrorToast(err.message || "Something went wrong. Please try again.");
//            } finally {
//                isProcessing = false;
//                paymentButton.disabled = false;
//                paymentButton.innerHTML = '<i class="fas fa-link button-icon"></i> Generate Payment Link';
//            }
//        });

//        form.addEventListener('focusin', function (e) {
//            if (e.target.matches('input, select, textarea')) clearFieldError(e.target);
//        });

//        form.addEventListener('input', function (e) {
//            if (e.target.matches('input, select, textarea')) clearFieldError(e.target);
//        });

//        form.addEventListener('change', function (e) {
//            if (e.target.matches('input[type="radio"]')) clearFieldError(e.target);
//        });
//    }


//    if (resetBtn) {
//        resetBtn.addEventListener('click', () => {
//            document.querySelectorAll('input, textarea, select').forEach(el => {
//                if (el.type === 'radio' || el.type === 'checkbox') {
//                    el.checked = false;
//                } else {
//                    el.value = '';
//                }
//            });

//            document.querySelectorAll('select').forEach(el => el.selectedIndex = 0);

//            document.querySelectorAll('.validation-error').forEach(el => el.remove());
//            document.querySelectorAll('input, select, textarea').forEach(el => {
//                el.style.borderColor = '';
//            });
//        });
//    }

//    function validateRequiredFields() {
//        const requiredFields = [
//            { id: 'transType', type: 'select', label: 'Transaction Type' },
//            { id: 'name', label: 'Full Name' },
//            { id: 'email', label: 'Email Address', validation: validateEmail },
//            { id: 'mobile', label: 'Mobile Number', validation: validateMobile },
//            { id: 'address1', label: 'Address Line 1' },
//            { id: 'pincode', label: 'Pin Code', validation: validatePincode },
//            { id: 'city', label: 'City' },
//            { id: 'state', label: 'State' },
//            { id: 'requestor-mobile', label: 'Requestor Mobile', validation: validateMobile },
//            { id: 'requestor-emails-list', label: 'Requestor Email List', validation: validateEmailList },
//            { id: 'product', type: 'select', label: 'Product' },
//            { id: 'amount', label: 'Amount', validation: validateAmount }
//        ];

//        let isValid = true;

//        requiredFields.forEach(field => {
//            let value = null;
//            let inputElement = document.getElementById(field.id);

//            if (field.type === 'select') {
//                value = inputElement && inputElement.value !== '';
//            } else {
//                value = inputElement && inputElement.value.trim() !== '';
//            }

//            if (!value) {
//                isValid = false;
//                showFieldError(inputElement, `${field.label} is required.`);
//            } else if (field.validation) {
//                const validationResult = field.validation(inputElement.value.trim());
//                if (validationResult !== true) {
//                    isValid = false;
//                    showFieldError(inputElement, validationResult);
//                }
//            }
//        });

//        return isValid;
//    }

//    function showFieldError(inputElement, message) {
//        if (!inputElement) return;
//        const existingError = inputElement.parentNode.querySelector('.validation-error');
//        if (existingError) {
//            existingError.textContent = message;
//            return;
//        }

//        const errorMsg = document.createElement('div');
//        errorMsg.className = 'validation-error';
//        errorMsg.style.color = '#dc3545';
//        errorMsg.style.marginTop = '4px';
//        errorMsg.style.fontSize = '0.8rem';
//        errorMsg.textContent = message;
//        inputElement.parentNode.appendChild(errorMsg);
//        inputElement.style.borderColor = '#dc3545';
//    }

//    function clearFieldError(inputElement) {
//        if (!inputElement) return;
//        if (inputElement.type === 'radio') {
//            document.querySelectorAll(`input[name="${inputElement.name}"]`).forEach(radio => {
//                radio.style.borderColor = '';
//                const parent = radio.closest('.radio-group') || radio.parentNode;
//                const error = parent.querySelector('.validation-error');
//                if (error) error.remove();
//            });
//        } else {
//            inputElement.style.borderColor = '';
//            const error = inputElement.parentNode.querySelector('.validation-error');
//            if (error) error.remove();
//        }
//    }

//    function removeAllValidationErrors() {
//        document.querySelectorAll('.validation-error').forEach(el => el.remove());
//        document.querySelectorAll('input, select, textarea').forEach(el => {
//            el.style.borderColor = '';
//        });
//    }

//    function collectFormData() {
//        const transactionType = document.getElementById('transType').value;

//        // Determine isAutoRenewal only for types other than NB and RL
//        let isAutoRenewal = null;
//        if (transactionType !== 'NB' && transactionType !== 'RL') {
//            const selectedOption = document.querySelector('input[name="autoRenewalOption"]:checked')?.value;
//            isAutoRenewal = selectedOption === 'AutoRenewal' ? true : selectedOption === 'StopAutoRenewal' ? false : null;
//        }

//        return {
//            ChannelType: document.querySelector('input[name="channelType"]:checked')?.value,
//            CustomerType: document.querySelector('input[name="customerType"]:checked')?.value,
//            TransactionType: transactionType,
//            Name: document.getElementById('name').value,
//            EmailId: document.getElementById('email').value,
//            MobileNumber: document.getElementById('mobile').value,
//            Address1: document.getElementById('address1').value,
//            Address2: document.getElementById('address2')?.value,
//            PinCode: document.getElementById('pincode').value,
//            Locality: document.getElementById('locality')?.value,
//            City: document.getElementById('city').value,
//            State: document.getElementById('state').value,
//            RequestorMobile: document.getElementById('requestor-mobile').value,
//            RequestorEmails: document.getElementById('requestor-emails-list').value,
//            Product: document.getElementById('product').value,
//            Amount: parseFloat(document.getElementById('amount').value),
//            Remarks: document.getElementById('remarks')?.value,
//            Gender: document.querySelector('input[name="gender"]:checked')?.value,
//            Salutation: document.getElementById('salutation').value,
//            PolicyNumber: document.getElementById('policyNumber')?.value,
//            KYC_ID: document.getElementById('kycId')?.value,
//            isAutoRenewal: isAutoRenewal
//        };
//    }


//    function validateEmail(email) {
//        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//        return re.test(email) || 'Please enter a valid email address';
//    }

//    function validateMobile(mobile) {
//        const re = /^[0-9]{10}$/;
//        return re.test(mobile) || 'Please enter a valid 10-digit mobile number';
//    }

//    function validatePincode(pincode) {
//        const re = /^[0-9]{6}$/;
//        return re.test(pincode) || 'Please enter a valid 6-digit pincode';
//    }

//    function validateAmount(amount) {
//        return !isNaN(parseFloat(amount)) && isFinite(amount) || 'Please enter a valid amount';
//    }

//    function validateEmailList(emails) {
//        const emailList = emails.split(/[,;]/).map(e => e.trim());
//        const invalidEmails = emailList.filter(e => !validateEmail(e));
//        return invalidEmails.length === 0 || 'Contains invalid email addresses';
//    }

//    function showErrorToast(message) {
//        alert(`Error: ${message}`);
//    }
//});


document.addEventListener('DOMContentLoaded', function () {
    const paymentButton = document.querySelector('.btn-send-payment');
    const form = document.querySelector('.allSections');
    const resetBtn = document.querySelector('.btn-reset-form');
    const transType = document.getElementById('transType');
    const section4 = document.getElementById('section4Container');
    const uploadGroup = document.getElementById('uploadGroup');
    const fileInput = document.getElementById('uploadFiles');
    const fileList = document.getElementById('uploadedFilesList');

    let uploadedFiles = [];

    // Disable browser autocomplete globally
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.setAttribute('autocomplete', 'off');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('spellcheck', 'false');
    });

    // --- Section 4: Renewal Checkbox Logic ---
    function updateSection4Visibility() {
        const value = transType?.value;
        if (!value) return;
        section4.style.display = (value === 'NB' || value === 'RL') ? 'none' : 'flex';
    }

    if (transType) {
        transType.addEventListener('change', updateSection4Visibility);
        updateSection4Visibility(); // Initial load
    }

    document.querySelectorAll('input[name="autoRenewalOption"]').forEach(cb => {
        cb.addEventListener('change', function () {
            document.querySelectorAll('input[name="autoRenewalOption"]').forEach(other => {
                if (other !== this) other.checked = false;
            });

            if (this.value === 'StopAutoRenewal' && this.checked) {
                uploadGroup.style.display = 'flex';
            } else {
                uploadGroup.style.display = 'none';
                uploadedFiles = [];
                renderFileList();
            }
        });
    });

    fileInput?.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.slice(0, 4 - uploadedFiles.length);
        uploadedFiles.push(...newFiles);
        if (uploadedFiles.length > 4) uploadedFiles = uploadedFiles.slice(0, 4);
        renderFileList();
        e.target.value = '';
    });

    function renderFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';
        uploadedFiles.forEach((file, index) => {
            const span = document.createElement('div');
            span.className = 'file-tag';
            span.innerHTML = `
                ${file.name}
                <i class="fas fa-times remove-file" data-index="${index}" title="Remove" style="margin-left: 8px; cursor: pointer;"></i>
            `;
            fileList.appendChild(span);
        });
    }

    fileList.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-file')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            uploadedFiles.splice(index, 1);
            renderFileList();
        }
    });

    // --- Payment Button Logic ---
    if (paymentButton && form) {
        let isProcessing = false;

        paymentButton.addEventListener('click', async function (e) {
            e.preventDefault();
            if (isProcessing) return;
            isProcessing = true;
            paymentButton.disabled = true;
            paymentButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            try {
                removeAllValidationErrors();
                if (!validateRequiredFields()) return;

                const transactionType = document.getElementById("transType").value;

                const generateRes = await fetch('/PaymentForm/GenerateShortPaymentLink', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
                    },
                    body: JSON.stringify({ transactionType })
                });

                if (!generateRes.ok) throw new Error("Error generating payment link.");
                const { jobRequestId, invoiceNo, paymentReferenceNo, shortUrl } = await generateRes.json();

                const prePayData = collectFormData();
                prePayData.JobRequestId = jobRequestId;
                prePayData.InvoiceNo = invoiceNo;
                prePayData.PaymentReferenceNo = paymentReferenceNo;
                prePayData.PaymentLink = shortUrl;
                prePayData.ShortUrl = shortUrl;
                prePayData.UrlExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

                const selectedOption = document.querySelector('input[name="autoRenewalOption"]:checked')?.value;
                prePayData.isAutoRenewal = selectedOption === 'AutoRenewal' ? true : selectedOption === 'StopAutoRenewal' ? false : null;

                if (selectedOption === 'StopAutoRenewal') {
                    if (!uploadedFiles.length) {
                        throw new Error("Files are required for Stop AutoRenewal.");
                    }

                    const formData = new FormData();
                    formData.append("invoiceNumber", invoiceNo);
                    uploadedFiles.forEach(file => {
                        formData.append("files", file);
                    });

                    const uploadRes = await fetch('/PaymentForm/UploadAndZipFiles', {
                        method: 'POST',
                        body: formData
                    });

                    if (!uploadRes.ok) throw new Error("File upload failed.");
                    const uploadResult = await uploadRes.json();
                    prePayData.UploadedFilesPath = uploadResult.zipPath;
                }

                sessionStorage.setItem('PrePaymentData', JSON.stringify(prePayData));

                await fetch('/SendPaymentLink/StorePrePaymentData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
                    },
                    body: JSON.stringify(prePayData)
                });

                window.location.href = '/SendPaymentLink';
            } catch (err) {
                console.error("Payment Error:", err);
                showErrorToast(err.message || "Something went wrong. Please try again.");
            } finally {
                isProcessing = false;
                paymentButton.disabled = false;
                paymentButton.innerHTML = '<i class="fas fa-link button-icon"></i> Generate Payment Link';
            }
        });
    }

    // --- Reset Button ---
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.type === 'radio' || el.type === 'checkbox') {
                    el.checked = false;
                } else {
                    el.value = '';
                }
            });
            document.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
            document.querySelectorAll('.validation-error').forEach(el => el.remove());
            document.querySelectorAll('input, select, textarea').forEach(el => {
                el.style.borderColor = '';
            });
        });
    }

    // --- Form Helpers ---
    function validateRequiredFields() {
        const requiredFields = [
            { id: 'transType', type: 'select', label: 'Transaction Type' },
            { id: 'name', label: 'Full Name' },
            { id: 'email', label: 'Email Address', validation: validateEmail },
            { id: 'mobile', label: 'Mobile Number', validation: validateMobile },
            { id: 'address1', label: 'Address Line 1' },
            { id: 'pincode', label: 'Pin Code', validation: validatePincode },
            { id: 'city', label: 'City' },
            { id: 'state', label: 'State' },
            { id: 'requestor-mobile', label: 'Requestor Mobile', validation: validateMobile },
            { id: 'requestor-emails-list', label: 'Requestor Email List', validation: validateEmailList },
            { id: 'product', type: 'select', label: 'Product' },
            { id: 'amount', label: 'Amount', validation: validateAmount }
        ];

        let isValid = true;

        requiredFields.forEach(field => {
            let inputElement = document.getElementById(field.id);
            if (!inputElement || inputElement.offsetParent === null) return;

            const value = inputElement.value.trim();
            if (!value) {
                isValid = false;
                showFieldError(inputElement, `${field.label} is required.`);
            } else if (field.validation) {
                const result = field.validation(value);
                if (result !== true) {
                    isValid = false;
                    showFieldError(inputElement, result);
                }
            }
        });

        return isValid;
    }

    function collectFormData() {
        const transactionType = document.getElementById('transType').value;
        return {
            ChannelType: document.querySelector('input[name="channelType"]:checked')?.value,
            CustomerType: document.querySelector('input[name="customerType"]:checked')?.value,
            TransactionType: transactionType,
            Name: document.getElementById('name').value,
            EmailId: document.getElementById('email').value,
            MobileNumber: document.getElementById('mobile').value,
            Address1: document.getElementById('address1').value,
            Address2: document.getElementById('address2')?.value,
            PinCode: document.getElementById('pincode').value,
            Locality: document.getElementById('locality')?.value,
            City: document.getElementById('city').value,
            State: document.getElementById('state').value,
            RequestorMobile: document.getElementById('requestor-mobile').value,
            RequestorEmails: document.getElementById('requestor-emails-list').value,
            Product: document.getElementById('product').value,
            Amount: parseFloat(document.getElementById('amount').value),
            Remarks: document.getElementById('remarks')?.value,
            Gender: document.querySelector('input[name="gender"]:checked')?.value,
            Salutation: document.getElementById('salutation').value,
            PolicyNumber: document.getElementById('policyNumber')?.value,
            KYC_ID: document.getElementById('kycId')?.value,
            isAutoRenewal: null // will be overridden above if needed
        };
    }

    function showFieldError(inputElement, message) {
        if (!inputElement) return;
        const error = document.createElement('div');
        error.className = 'validation-error';
        error.style.color = '#dc3545';
        error.style.fontSize = '0.8rem';
        error.style.marginTop = '4px';
        error.textContent = message;
        inputElement.parentNode.appendChild(error);
        inputElement.style.borderColor = '#dc3545';
    }

    function removeAllValidationErrors() {
        document.querySelectorAll('.validation-error').forEach(el => el.remove());
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.style.borderColor = '';
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) || 'Invalid email';
    }

    function validateMobile(mobile) {
        const re = /^[0-9]{10}$/;
        return re.test(mobile) || 'Invalid mobile number';
    }

    function validatePincode(pincode) {
        const re = /^[0-9]{6}$/;
        return re.test(pincode) || 'Invalid pincode';
    }

    function validateAmount(amount) {
        return !isNaN(parseFloat(amount)) && isFinite(amount) || 'Enter a valid amount';
    }

    function validateEmailList(emails) {
        const emailList = emails.split(/[,;]/).map(e => e.trim());
        const invalid = emailList.filter(e => !validateEmail(e));
        return invalid.length === 0 || 'Contains invalid emails';
    }

    function showErrorToast(message) {
        alert(`Error: ${message}`);
    }
});
