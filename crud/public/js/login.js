document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Codigo para ver la contraseña (icono del ojo)
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.style.color = type === 'text' ? '#ff9800' : '#666';
        });
    }

    // Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.style.display = 'none';

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/api/sessions/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    if (response.redirected) {
                        window.location.href = response.url;
                    } else {
                        window.location.href = '/profile';
                    }
                } else {
                    const result = await response.json();
                    errorMessage.textContent = result.message || "Usuario o contraseña incorrectos";
                    errorMessage.style.display = 'block';
                    alert("error contraseña o email incorrecto");
                }
            } catch (error) {
                console.error(error);
                errorMessage.textContent = "Error de conexión";
                errorMessage.style.display = 'block';
            }
        });
    }
});
