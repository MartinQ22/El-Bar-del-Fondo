import { jest } from "@jest/globals";
import { successResponse, errorResponse } from "../src/utils/apiResponse.utils";

function createMockResponse(){
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }
}

describe("apiResponse helpers", ()=>{
    test("successResponse deberia enviar respuesta exitosa con status 200 y devuelva propiedad de message y payload", ()=>{
        const res = createMockResponse();

        successResponse(res, {message: "ok", payload: {id: 1}});
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "ok",
            payload: {id: 1}
        })
    })

    test("errorResponse deberia enviar respuesta de error con status 500 por defecto y mensaje de error", ()=>{
        const res = createMockResponse();

        errorResponse(res, {message: "error message"});

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "error message"
        })
    })

    test("errorResponse deberia responder con estructura de error", ()=>{
        const res = createMockResponse()

        errorResponse(res, {
            statusCode: 404,
            message: "Not Found"
        })

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Not Found"
        })
    })
})