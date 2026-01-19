//REGISTRO DE USUARIO 
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/sessions/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const responseData = await response.json();
                
                if (response.ok && responseData.success) {
                    
                    window.location.href = responseData.redirect || '/';
                } else {
                    alert(responseData.message || 'Lo sentimos, hubo un error al registrar usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});

