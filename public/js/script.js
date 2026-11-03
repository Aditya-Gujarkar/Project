// Example starter JavaScript for preventing form submissions when there are invalid fields
(() => {
  'use strict'

  const forms = document.querySelectorAll('form.needs-validation') // it should be same as class name in form tag

  for (const form of forms) {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
form.classList.add('was-validated');  // this adds CSS class to the form which will show the error messages for invalid fields

      for (const control of form.elements) {
        if (control.willValidate) {
          control.setAttribute('aria-invalid', String(!control.validity.valid))
        }
      }
    })

    // Clear aria-invalid as users correct individual fields
    form.addEventListener('input', event => {
      const control = event.target
      if (control.willValidate && control.hasAttribute('aria-invalid')) {
        control.setAttribute('aria-invalid', String(!control.validity.valid))
      }
    })
  }
})()