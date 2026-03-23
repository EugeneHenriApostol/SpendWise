using SpendWise.Repository;
using SpendWise.Models;
using SpendWise.DTO.Category;

namespace SpendWise.Service
{
    public class CategoryService
    {
        private readonly CategoryRepository _categoryRepo;

        public CategoryService(CategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<CategoryResponseDto> AddCategory(string userId, CreateCategoryDto dto)
        {
            var category = new Category
            {
                UserId = userId,
                CategoryName = dto.CategoryName,
                CategoryType = dto.CategoryType
            };

            category.MarkCreated();

            await _categoryRepo.AddAsync(category);

            return MapToDto(category);
        }

        public async Task<List<CategoryResponseDto>> GetAllCategories(string userId)
        {
            var categories = await _categoryRepo.GetAllAsync(userId);

            return categories.Select(MapToDto).ToList();
        }

        public async Task<CategoryResponseDto> GetCategoryById(string userId, int categoryId)
        {
            var category = await _categoryRepo.GetByIdAsync(userId, categoryId);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            return MapToDto(category);
        }

        public async Task<CategoryResponseDto> UpdateCategory(string userId, int categoryId, UpdateCategoryDto dto)
        {
            var category = await _categoryRepo.GetByIdAsync(userId, categoryId);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            category.CategoryName = dto.CategoryName;
            category.CategoryType = dto.CategoryType;
            category.MarkUpdated();

            await _categoryRepo.SaveChangesAsync();

            return MapToDto(category);
        }

        public async Task<CategoryResponseDto> DeleteCategory(string userId, int categoryId)
        {
            var category = await _categoryRepo.GetByIdAsync(userId, categoryId);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            category.SoftDelete();
            category.MarkUpdated();

            await _categoryRepo.SaveChangesAsync();

            return MapToDto(category);
        }

        private static CategoryResponseDto MapToDto(Category category)
        {
            return new CategoryResponseDto
            {
                Id = category.Id,
                CategoryName = category.CategoryName,
                CategoryType = category.CategoryType
            };
        }
    }
}