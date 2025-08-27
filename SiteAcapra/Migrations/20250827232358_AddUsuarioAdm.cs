using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiteAcapra.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioAdm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Usuario",
                columns: new[] { "UsuarioId", "Cpf", "DataNascimento", "Email", "Endereco", "Nome", "Senha", "Sexo", "Telefone", "TipoUsuarioId" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "00000000000", new DateOnly(2000, 1, 1), "adm@acapra.com", "Endereço do Administrador", "Administrador", "$2a$11$5U1NDLDWuSfVKTQRIgereuQ81YCMjhimZ2qpYM0WMcdjgkY7hEhwi", "M", "00000000000", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Usuario",
                keyColumn: "UsuarioId",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));
        }
    }
}
