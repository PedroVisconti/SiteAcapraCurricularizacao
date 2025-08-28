using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SiteAcapra.Services
{
    public class JwtService
    {
        private readonly string _secretKey;
        private readonly int _expiryDuration;

        public JwtService(string secretKey, int expiryDuration)
        {
            _secretKey = secretKey;
            _expiryDuration = expiryDuration;
        }

        public string GerarToken(Guid usuarioId, string Email, string Senha)
        {
            var key = Encoding.ASCII.GetBytes(_secretKey);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuarioId.ToString()),
                    new Claim(ClaimTypes.Email, Email),
                    new Claim(ClaimTypes.Hash, Senha)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_expiryDuration),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
