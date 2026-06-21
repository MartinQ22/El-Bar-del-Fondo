document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
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

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const inputs = registerForm.querySelectorAll('input');
            inputs.forEach(input => input.style.border = '');

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);
            let hasError = false;

            // Validación Simple
            for (const [key, value] of Object.entries(data)) {
                if (!value) {
                    const input = registerForm.querySelector(`[name="${key}"]`);
                    if (input) input.style.border = '2px solid red';
                    hasError = true;
                }
            }

            // Password Regex Validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(data.password)) {
                const passInput = registerForm.querySelector('[name="password"]');
                if (passInput) passInput.style.border = '2px solid red';
                alert('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
                hasError = true;
            }

            if (hasError) return;

            try {
                
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert(responseData.message || 'Error al registrar usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});