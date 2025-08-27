using SiteAcapra.Validations;
using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.DTOs.Requests
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$",ErrorMessage = "A senha deve ter pelo menos 8 caracteres, incluindo ao menos uma letra maiúscula, um número e um caractere especial")]
        public string Senha { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório")]
        [CpfValidations(ErrorMessage = "o CPF infomado não é valido")]
        public string Cpf { get; set; }

        [Required(ErrorMessage = "Telefone é obrigatório")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "Endereço é obrigatório")]
        public string Endereco { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatório")]
        public DateOnly DataNascimento { get; set; }

        [Required(ErrorMessage = "Sexo é obrigatório")]
        public char Sexo { get; set; }
    }
}
