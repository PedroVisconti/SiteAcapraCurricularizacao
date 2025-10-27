using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiteAcapra.Migrations
{
    /// <inheritdoc />
    public partial class adicaoSituacaoAnimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Situacao",
                table: "Animal",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Situacao",
                table: "Animal");
        }
    }
}
