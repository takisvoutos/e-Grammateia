using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class UserDepartment1234 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Departments_DepartmentID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_DepartmentID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DepartmentID",
                table: "Users");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentID",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartmentID",
                table: "Users",
                column: "DepartmentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Departments_DepartmentID",
                table: "Users",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
