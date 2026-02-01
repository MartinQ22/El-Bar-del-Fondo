document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);

            // --- VALIDACIÓN CON REGEXP (TU PENDIENTE) ---
            // Requisito: Mínimo 8 caracteres, al menos una mayúscula y un número
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            
            if (!passwordRegex.test(data.password)) {
                alert('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
                return; // Cortamos la ejecución aquí
            }
            // --------------------------------------------

            try {
                // Asegúrate de que esta ruta coincida con tu router de backend
                const response = await fetch('/api/users/register', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const responseData = await response.json();
                
                if (response.ok) {
                    alert('¡Registro exitoso!');
                    window.location.href = '/login'; 
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