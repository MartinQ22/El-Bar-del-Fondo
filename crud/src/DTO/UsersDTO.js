
//Evitar pasar datos sensibles
export class UsersDTO {
    setSessionUser(user) {
        const userData = {
            first_name: user.first_name,
            email: user.email,
            role: user.role
        };
        return userData;
    }
//normalize sin usar
    // normalizeFields(user){
    //     return {
    //         first_name :user.nombre, 
    //         last_name:user.apellido, 
    //         email:user.email, 
    //         role:user.rol, 
    //         password:user.contraseña
    //     }
    // }
}