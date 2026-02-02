using Microsoft.AspNetCore.Identity;
using SpendWise.DTO.Authentication;

namespace SpendWise.Service.Interface
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginDto dto);
        Task<AuthResult> SignUpAsync(SignUpDto dto);
    }

    public record AuthResult (
        bool Success,
        string? ErrorMessage,
        AuthResponseDto? User
    );
}
