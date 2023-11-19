using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class GradeTableFKUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grade_User_StudentID",
                table: "Grade");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Student_StudentID",
                table: "Grade",
                column: "StudentID",
                principalTable: "Student",
                principalColumn: "StudentID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Student_StudentID",
                table: "Grade");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_User_StudentID",
                table: "Grade",
                column: "StudentID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
