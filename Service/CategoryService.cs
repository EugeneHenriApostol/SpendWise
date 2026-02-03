using SpendWise.DTO.Category;
using SpendWise.Models;
using SpendWise.Repository;

namespace SpendWise.Service
{
    public class CategoryService
    {
        private readonly CategoryRepository _categoryRepo;

        public CategoryService(CategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<CategoryResponseDto> AddCategory(string userId, Category category)
        {
            var existing = await _categoryRepo.GetCategoryById(userId, category.Id);

            if (existing != null)
            {
                throw new KeyNotFoundException("This category already exists");
            }
 
            var newCategory = await _categoryRepo.AddCategory(category);

            return new CategoryResponseDto
            {
                Type = newCategory.CategoryType,
                Name = newCategory.CategoryName
            };
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategories(string userId)
        {
            var categories = await _categoryRepo.GetAllCategories(userId);

            return categories.Select(c => new CategoryResponseDto
            {
                Type = c.CategoryType,
                Name = c.CategoryName
            });
        }

        public async Task<CategoryResponseDto> GetCategoryById(string userId, int categoryId)
        {
            var category = await _categoryRepo.GetCategoryById(userId, categoryId);

            return new CategoryResponseDto
            {
                Type = category.CategoryType,
                Name = category.CategoryName
            };
        }

        public async Task<CategoryResponseDto> UpdateCategory(string userId, int categoryId, UpdateCategoryDto dto)
        {
            var updateCategory = await _categoryRepo.UpdateCategory(userId, categoryId, dto);

            return new CategoryResponseDto
            {
                Type = updateCategory.CategoryType,
                Name = updateCategory.CategoryName,
            };
        }

        public async Task<CategoryResponseDto> DeleteCategory(string userId, int categoryId)
        {
            var deleteCategory = await _categoryRepo.DeleteCategory(userId, categoryId);

            return new CategoryResponseDto
            {
                Type = deleteCategory.CategoryType,
                Name = deleteCategory.CategoryName
            };
        }
    }
}
