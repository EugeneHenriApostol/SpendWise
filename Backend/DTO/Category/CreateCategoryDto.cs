namespace SpendWise.DTO.Category
{
    public class CreateCategoryDto
    {
        public int Id { get; set; }
        public string CategoryType { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
    }
}
