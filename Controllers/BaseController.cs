using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) 
                        ?? throw new UnauthorizedAccessException("User ID not found");
    }
}
