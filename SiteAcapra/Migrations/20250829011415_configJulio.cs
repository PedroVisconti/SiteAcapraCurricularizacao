using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiteAcapra.Migrations
{
    /// <inheritdoc />
    public partial class configJulio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Formulario_Usuario",
                table: "FormularioAdocao");

            migrationBuilder.DropTable(
                name: "Foto");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataPreenchimento",
                table: "FormularioAdocao",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AddColumn<bool>(
                name: "AcessoARua",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ConcordaCastracaoVacinacao",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ConcordaTaxaColaborativa",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ConcordanciaResidencia",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CondicoesManterAnimal",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DataNascimento",
                table: "FormularioAdocao",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Endereco",
                table: "FormularioAdocao",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomeCompleto",
                table: "FormularioAdocao",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "OutrosAnimaisCastradosVacinados",
                table: "FormularioAdocao",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuaisOutrosAnimais",
                table: "FormularioAdocao",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Renda",
                table: "FormularioAdocao",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ResidenciaPropriedade",
                table: "FormularioAdocao",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ResidenciaTemTelas",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ResidenciaTipo",
                table: "FormularioAdocao",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "FormularioAdocao",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<bool>(
                name: "TemOutrosAnimais",
                table: "FormularioAdocao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "FotoDoAnimal",
                columns: table => new
                {
                    FotoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FotoHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Excluido = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    AnimalId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FotoDoAnimal", x => x.FotoId);
                    table.ForeignKey(
                        name: "FK_Foto_Animal",
                        column: x => x.AnimalId,
                        principalTable: "Animal",
                        principalColumn: "AnimalId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FotosDocumentos",
                columns: table => new
                {
                    FotoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FotoHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Excluido = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FormularioId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FotosDocumentos", x => x.FotoId);
                    table.ForeignKey(
                        name: "FK_FotosDocumentos_FormularioAdocao_FormularioId",
                        column: x => x.FormularioId,
                        principalTable: "FormularioAdocao",
                        principalColumn: "FormularioAdocaoId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FotoDoAnimal_AnimalId",
                table: "FotoDoAnimal",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_FotosDocumentos_FormularioId",
                table: "FotosDocumentos",
                column: "FormularioId");

            migrationBuilder.AddForeignKey(
                name: "FK_FormularioAdocao_Usuario_UsuarioId",
                table: "FormularioAdocao",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FormularioAdocao_Usuario_UsuarioId",
                table: "FormularioAdocao");

            migrationBuilder.DropTable(
                name: "FotoDoAnimal");

            migrationBuilder.DropTable(
                name: "FotosDocumentos");

            migrationBuilder.DropColumn(
                name: "AcessoARua",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "ConcordaCastracaoVacinacao",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "ConcordaTaxaColaborativa",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "ConcordanciaResidencia",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "CondicoesManterAnimal",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "DataNascimento",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "Endereco",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "NomeCompleto",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "OutrosAnimaisCastradosVacinados",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "QuaisOutrosAnimais",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "Renda",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "ResidenciaPropriedade",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "ResidenciaTemTelas",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "ResidenciaTipo",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "FormularioAdocao");

            migrationBuilder.DropColumn(
                name: "TemOutrosAnimais",
                table: "FormularioAdocao");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataPreenchimento",
                table: "FormularioAdocao",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "Foto",
                columns: table => new
                {
                    FotoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<int>(type: "int", nullable: false),
                    Excluido = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FotoHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Foto", x => x.FotoId);
                    table.ForeignKey(
                        name: "FK_Foto_Animal",
                        column: x => x.AnimalId,
                        principalTable: "Animal",
                        principalColumn: "AnimalId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Foto_AnimalId",
                table: "Foto",
                column: "AnimalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Formulario_Usuario",
                table: "FormularioAdocao",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
