using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class UserCourseUpdate123 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TeacherID",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_TeacherID",
                table: "Courses",
                column: "TeacherID");

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

            migrationBuilder.DropIndex(
                name: "IX_Courses_TeacherID",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "TeacherID",
                table: "Courses");
        }
    }
}
