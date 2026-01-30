// showPassword.js
export function setupShowPassword(toggleSelector, inputSelector) {
  const togglePassword = document.querySelector(toggleSelector)
  const passwordInput = document.querySelector(inputSelector)

  if (!togglePassword || !passwordInput) return

  togglePassword.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password'
  })
}
