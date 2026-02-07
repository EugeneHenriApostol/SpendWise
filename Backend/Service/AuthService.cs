using Microsoft.AspNetCore.Identity;
using SpendWise.Models;
using SpendWise.DTO.Authentication;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace SpendWise.Service
{
    public class AuthService
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(SignInManager<User> signInManager,
                            UserManager<User> userManager,
                            IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<AuthResult> Login(LoginDto dto)
        {
            // check if user exists
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
            {
                return new AuthResult(false, "Invalid email or password", null);
            }

            // check if password is correct
            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);

            if (!result.Succeeded)
            {
                return new AuthResult(false, "Invalid email or password", null);
            }

            var token = GenerateJwt(user);

            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    UserName = user.UserName!
                }
            };

            return new AuthResult(true, null, response);
        }

        public async Task<AuthResult> SignUp(SignUpDto dto)
        {
            // check if email is already registered
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                return new AuthResult(false, "Email is already registered", null);
            }

            var user = new User
            {
                Email = dto.Email,
                UserName = dto.Email
            };

            user.MarkCreated();
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return new AuthResult(false, errors, null);
            }

            var token = GenerateJwt(user);

            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    UserName = user.UserName!
                }
            };

            return new AuthResult (true, null, response);
        }

        // helper function - generate jwt
        private string GenerateJwt(User user)
        {
            var tokenHandler = new JsonWebTokenHandler();


            // jwt settings
            var key = _configuration["Jwt:Key"] ?? throw new Exception("Jwt Key is missing");
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expiresMinutes = int.Parse(_configuration["Jwt:ExpiresMinutes"] ?? "60");

            var signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key));

            // define claims
            var claims = new Dictionary<string, object>
            {
                { ClaimTypes.NameIdentifier, user.Id },
                { ClaimTypes.Email, user.Email! },
                { ClaimTypes.Name, user.UserName! },
            };

            // token descriptor
            var descriptor = new SecurityTokenDescriptor
            {
                Issuer = issuer,
                Audience = audience,
                Subject = new ClaimsIdentity(claims
                            .Select(c => new Claim(
                                c.Key, c.Value.ToString()!)
                            )
                           ),
                Expires = DateTime.UtcNow.AddMinutes(expiresMinutes),
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            };

            return tokenHandler.CreateToken(descriptor);
        }

        public record AuthResult(
                    bool Success,
                    string? ErrorMessage,
                    AuthResponseDto? User
        );
    }
}
