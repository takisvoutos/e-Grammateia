using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class UpdateCourseTeacherIdNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Users_TeacherID",
                table: "Courses");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Users_TeacherID",
                table: "Courses",
                column: "TeacherID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Users_TeacherID",
                table: "Courses");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Users_TeacherID",
                table: "Courses",
                column: "TeacherID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
