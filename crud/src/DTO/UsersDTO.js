
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

}