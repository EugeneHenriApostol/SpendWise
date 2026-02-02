using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.DTO;
using SpendWise.Models;

namespace SpendWise.Repository
{
    public class CategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Category> AddCategory(Category category)
        {
            category.MarkCreated();

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<Category> UpdateCategory(string userId, int categoryId, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId);
            if (category == null)
            {
                throw new Exception("Category does not exist");
            }

            category.CategoryType = dto.CategoryType;
            category.CategoryName = dto.CategoryName;

            category.MarkUpdated();

            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<IEnumerable<Category>> GetAllCategory(string userId)
        {
            return await _context.Categories.Where(c => c.UserId == userId && !c.IsDeleted).ToListAsync();
        }

        public async Task<Category> GetCategoryById(string userId, int categoryId)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => 
                                                        c.UserId == userId && c.Id == categoryId 
                                                        && !c.IsDeleted);
            if (category == null)
            {
                throw new Exception("Category not found");
            }

            return category;
        }

        public async Task<Category> DeleteCategory(string userId, int categoryId)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId && !c.IsDeleted);

            if (category == null)
            {
                throw new Exception("Category does not exist");
            }

            category.SoftDelete();

            await _context.SaveChangesAsync();
            return category;
        }
    }
}
