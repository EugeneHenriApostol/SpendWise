using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpendWise.DTO.Category;
using SpendWise.Models;
using SpendWise.Service;
using System.Security.Claims;

namespace SpendWise.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory(CreateCategoryDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _service.AddCategory(userId, dto);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _service.GetAllCategories(userId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _service.GetCategoryById(userId, id);

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _service.UpdateCategory(userId, id, dto);

            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _service.DeleteCategory(userId, id);

            return Ok(result);
        }
    }
}
