from fastapi import Request
from fastapi.responses import JSONResponse

class AgriSenseException(Exception):
    def __init__(self, status_code: int, detail: str, code: str = "ERROR"):
        self.status_code = status_code
        self.detail      = detail
        self.code        = code

async def agrisense_exception_handler(request: Request, exc: AgriSenseException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"code": exc.code, "message": exc.detail}},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}},
    )
