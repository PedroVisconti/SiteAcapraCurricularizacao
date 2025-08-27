using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.Validations
{
    public class CpfValidations : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null) return false;

            var cpf = value.ToString().Replace(".", "").Replace("-", "");

            if (cpf.Length != 11 || !cpf.All(char.IsDigit))
                return false;

            // Elimina CPFs inválidos conhecidos (111.111.111-11 etc.)
            if (cpf.Distinct().Count() == 1)
                return false;

            // Calcula dígitos verificadores
            int[] multiplicador1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf = cpf.Substring(0, 9);
            int soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

            int resto = soma % 11;
            resto = resto < 2 ? 0 : 11 - resto;
            string digito = resto.ToString();
            tempCpf += digito;
            soma = 0;

            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

            resto = soma % 11;
            resto = resto < 2 ? 0 : 11 - resto;
            digito += resto.ToString();

            return cpf.EndsWith(digito);
        }
    }
}
