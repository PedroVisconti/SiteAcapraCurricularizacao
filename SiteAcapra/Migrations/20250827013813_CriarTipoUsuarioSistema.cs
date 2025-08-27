using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SiteAcapra.Migrations
{
    /// <inheritdoc />
    public partial class CriarTipoUsuarioSistema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "TipoUsuario",
                columns: new[] { "TipoUsuarioId", "Nome" },
                values: new object[,]
                {
                    { 1, "Administrador" },
                    { 2, "Adotante" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TipoUsuario",
                keyColumn: "TipoUsuarioId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TipoUsuario",
                keyColumn: "TipoUsuarioId",
                keyValue: 2);
        }
    }
}
