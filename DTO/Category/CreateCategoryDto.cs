namespace SpendWise.DTO.Category
{
    public class CreateCategoryDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
