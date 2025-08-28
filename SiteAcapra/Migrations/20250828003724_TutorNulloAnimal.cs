using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiteAcapra.Migrations
{
    /// <inheritdoc />
    public partial class TutorNulloAnimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "DataAplicacao",
                table: "Vacina",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "TutorId",
                table: "Animal",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataAplicacao",
                table: "Vacina");

            migrationBuilder.AlterColumn<Guid>(
                name: "TutorId",
                table: "Animal",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
