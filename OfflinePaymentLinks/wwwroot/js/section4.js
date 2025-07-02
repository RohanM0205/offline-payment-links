//document.addEventListener('DOMContentLoaded', () => {
//    const transType = document.getElementById('transType');
//    const section4 = document.getElementById('section4Container');
//    const uploadGroup = document.getElementById('uploadGroup');
//    const fileInput = document.getElementById('uploadFiles');
//    const fileList = document.getElementById('uploadedFilesList');
//    let uploadedFiles = [];

//    function updateSection4Visibility() {
//        const value = transType?.value;
//        if (!value) return;

//        if (value === 'NB' || value === 'RL') {
//            section4.style.display = 'none';
//        } else {
//            section4.style.display = 'flex';
//        }
//    }

//    if (transType) {
//        transType.addEventListener('change', updateSection4Visibility);
//        updateSection4Visibility(); // Initial load
//    }

//    document.querySelectorAll('input[name="autoRenewalOption"]').forEach(cb => {
//        cb.addEventListener('change', function () {
//            // Uncheck all others (make checkboxes act like radios)
//            document.querySelectorAll('input[name="autoRenewalOption"]').forEach(other => {
//                if (other !== this) other.checked = false;
//            });

//            // Handle upload group visibility
//            const uploadGroup = document.getElementById('uploadGroup');
//            if (this.value === 'StopAutoRenewal' && this.checked) {
//                uploadGroup.style.display = 'flex';
//            } else {
//                uploadGroup.style.display = 'none';
//                uploadedFiles = [];
//                renderFileList(); // Clear file preview if switching to AutoRenewal
//            }
//        });
//    });



//    fileInput?.addEventListener('change', (e) => {
//        const files = Array.from(e.target.files);
//        const newFiles = files.slice(0, 4 - uploadedFiles.length);
//        uploadedFiles.push(...newFiles);
//        if (uploadedFiles.length > 4) uploadedFiles = uploadedFiles.slice(0, 4);
//        renderFileList();
//        e.target.value = '';
//    });


//    function renderFileList() {
//        if (!fileList) return;
//        fileList.innerHTML = '';
//        if (uploadedFiles.length === 0) return;

//        uploadedFiles.forEach((file, index) => {
//            const span = document.createElement('div');
//            span.className = 'file-tag';
//            span.innerHTML = `${file.name} <i class="fas fa-times remove-file" data-index="${index}" title="Remove"></i>`;
//            fileList.appendChild(span);
//        });
//    }



//    fileList.addEventListener('click', function (e) {
//        if (e.target.classList.contains('remove-file')) {
//            const index = parseInt(e.target.getAttribute('data-index'));
//            uploadedFiles.splice(index, 1);
//            renderFileList();
//        }
//    });


//});
