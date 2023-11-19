using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class CourseTableFKUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Course_User_TeacherID",
                table: "Course");

            migrationBuilder.AddForeignKey(
                name: "FK_Course_Teacher_TeacherID",
                table: "Course",
                column: "TeacherID",
                principalTable: "Teacher",
                principalColumn: "TeacherID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Course_Teacher_TeacherID",
                table: "Course");

            migrationBuilder.AddForeignKey(
                name: "FK_Course_User_TeacherID",
                table: "Course",
                column: "TeacherID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
