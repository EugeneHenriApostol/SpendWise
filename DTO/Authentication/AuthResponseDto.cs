namespace SpendWise.DTO.Authentication
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = "";
        public UserResponseDto User { get; set; } = null!;
    }
}
