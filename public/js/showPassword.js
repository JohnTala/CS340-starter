export function setupShowPassword(toggleSelector, inputSelector) {
  const button = document.querySelector(toggleSelector)
  const password = document.querySelector(inputSelector)

  if (!button || !password) return

  button.addEventListener('click', function () {
    if (password.type === 'password') {
      password.type = 'text'
      button.value = 'Hide password'
    } else {
      password.type = 'password'
      button.value = 'Show password'
    }
  })
}
