using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class UserDepartment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "Users");

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

            migrationBuilder.CreateIndex(
                name: "IX_Student_DepartmentID",
                table: "Student",
                column: "DepartmentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Student_Departments_DepartmentID",
                table: "Student",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Departments_DepartmentID",
                table: "Users",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Student_Departments_DepartmentID",
                table: "Student");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Departments_DepartmentID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_DepartmentID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Student_DepartmentID",
                table: "Student");

            migrationBuilder.DropColumn(
                name: "DepartmentID",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }
    }
}
