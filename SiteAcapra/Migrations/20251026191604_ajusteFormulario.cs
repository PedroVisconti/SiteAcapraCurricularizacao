using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiteAcapra.Migrations
{
    /// <inheritdoc />
    public partial class ajusteFormulario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FotoHash",
                table: "FotosDocumentos",
                type: "nvarchar(MAX)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "FormularioAdocao",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "FormularioAdocao",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "FormularioAdocao");

            migrationBuilder.AlterColumn<string>(
                name: "FotoHash",
                table: "FotosDocumentos",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(MAX)");
        }
    }
}
