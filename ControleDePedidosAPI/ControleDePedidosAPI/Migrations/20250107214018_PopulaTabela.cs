using Microsoft.EntityFrameworkCore.Migrations;

namespace ControleDePedidosAPI.Migrations
{
    public partial class PopulaTabela : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Clientes",
                columns: new[] { "Id", "Email", "Nome" },
                values: new object[] { 1, "juliano.ferreira@alumisoft.com.br", "Juliano Ferreira" });

            migrationBuilder.InsertData(
                table: "Clientes",
                columns: new[] { "Id", "Email", "Nome" },
                values: new object[] { 2, "Ivan@alumisoft.com.br", "Ivan" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
