import Product from "../models/productModel.js";

export const renderLogin = async (req, res) => {
    res.render("login");
};

export const renderProfile = async (req, res) => {
    const { first_name, last_name, email, provider, role } = req.session.user;
    const isGithub = provider === 'github' || email.endsWith('@github.com');
    const isAdmin = role === 'admin';

    res.render("profile", {
        first_name, last_name, email, provider, isGithub, isAdmin
    });
};

export const renderRegister = (req, res) => {
    res.render('register');
};

export const renderHome = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const data = await Product.paginate({}, { limit, page, lean: true });
        const products = data.docs;
        delete data.docs;

        const links = []

        for (let index = 1; index <= data.totalPages; index++) {
            links.push({ text: index, link: `?limit=${limit}&page=${index}` })
        }

        res.render("home", { products, links })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export const renderProductDetail = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid).lean();

        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }

        res.render("productDetail", { product });
    } catch (error) {
        res.status(500).render("error", { message: "Error al cargar el producto" });
    }
};
export const renderResetPassword = (req, res) => {
    const { token } = req.query;
    res.render('resetPassword', { token });
};
