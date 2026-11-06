const imageInput = document.getElementById("image");
const newImagePreview = document.getElementById("newImagePreview");
const previewContainer = document.getElementById("previewContainer");

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

if (imageInput && newImagePreview && previewContainer) {
  imageInput.addEventListener("change", function () {
      let file = this.files[0];

      if (file) {
          newImagePreview.src = URL.createObjectURL(file);
          previewContainer.style.display = "block";
      } else {
          newImagePreview.src = "";
          previewContainer.style.display = "none";
      }
  });
}