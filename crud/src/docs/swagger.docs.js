import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const swaggerSpec = swaggerJSDoc({
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Ecommers API - Bar del Fondo",
            version: "0.5",
            description: "Documentacion de la API Ecommers",
        },
        servers:[ {
            url: "http://localhost:8080",
            description: "Servidor Local"
        }],
        components:{

            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },

            schemas: {
                Product: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "68ecb6f99407b0e3e0bf3096"
                        },
                        title: {
                            type: "string",
                            example: "MOUSE PERSONA 3"
                        },
                        description: {
                            type: "string",
                            example: "Mouse themed after Persona 3 Reload"
                        },
                        thumbnail: {
                            type: "string",
                            example: "https://cdn11.bigcommerce.com/s-k28u1tc9ki/products/163/images/768/P3R-DeskpadV3-Thumbnail__17004.1701131823.386.513.png?c=1"
                        },
                        code: {
                            type: "string",
                            example: "CODIGO1"
                        },
                        price: {
                            type: "number",
                            example: 20.24
                        },
                        category: {
                            type: "string",
                            example: "gaming"
                        },
                        stock: {
                            type: "number",
                            example: 10
                        },
                        status: {
                            type: "boolean",
                            example: true
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2025-10-13T08:21:09.050Z"
                        }
                    }
                },
                ProductsResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Lista de productos"
                        },
                        payload: {
                            type: "object",
                            properties: {
                                products: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Product"
                                    }
                                },
                                totalDocs: {
                                    type: "number",
                                    example: 50
                                },
                                limit: {
                                    type: "number",
                                    example: 10
                                },
                                page: {
                                    type: "number",
                                    example: 1
                                },
                                totalPages: {
                                    type: "number",
                                    example: 5
                                },
                                hasPrevPage: {
                                    type: "boolean",
                                    example: false
                                },
                                hasNextPage: {
                                    type: "boolean",
                                    example: true
                                },
                                prevPage: {
                                    type: "number",
                                    example: null
                                },
                                nextPage: {
                                    type: "number",
                                    example: 2
                                }
                            }
                        }
                    }
                },
                ProductResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Producto encontrado"
                        },
                        payload: {
                            $ref: "#/components/schemas/Product"     
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error"
                        },
                        message: {
                            type: "string",
                            example: "Error al obtener el producto"
                        }
                    }
                },
                ProductInput: {
                    type: "object",
                    properties: {
                       title: {
                        type: "string",
                        example: "MOUSE PERSONA 3"
                       },
                       description: {
                        type: "string",
                        example: "MOUSE PERSONA 3"
                       },
                       price: {
                        type: "number",
                        example: 20.24
                       },
                       code: {
                        type: "string",
                        example: "MOUSE PERSONA 3"
                       },
                       stock: {
                        type: "number",
                        example: 10
                       },
                       category: {
                        type: "string",
                        example: "gaming"
                       },
                       thumbnail: {
                        type: "string",
                        example: "https://cdn11.bigcommerce.com/s-k28u1tc9ki/products/163/images/768/P3R-DeskpadV3-Thumbnail__1701131823.386.513.png?c=1"
                       }
                    },
                    required: ["title", "price", "code", "stock", "description", "category"]
                }
            }
        }
    },
    apis: [join(__dirname, "../routes/**/*.js").replace(/\\/g, "/")]
});