using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class UserTableName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Users_TeacherID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Users_StudentID",
                table: "Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_Student_Users_UserID",
                table: "Student");

            migrationBuilder.DropForeignKey(
                name: "FK_Teacher_Users_UserID",
                table: "Teacher");

            migrationBuilder.DropIndex(
                name: "IX_Teacher_UserID",
                table: "Teacher");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Teacher_UserID",
                table: "Teacher",
                column: "UserID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_User_TeacherID",
                table: "Courses",
                column: "TeacherID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_User_StudentID",
                table: "Grades",
                column: "StudentID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Student_User_UserID",
                table: "Student",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teacher_User_UserID",
                table: "Teacher",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_User_TeacherID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Grades_User_StudentID",
                table: "Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_Student_User_UserID",
                table: "Student");

            migrationBuilder.DropForeignKey(
                name: "FK_Teacher_User_UserID",
                table: "Teacher");

            migrationBuilder.DropIndex(
                name: "IX_Teacher_UserID",
                table: "Teacher");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Teacher_UserID",
                table: "Teacher",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Users_TeacherID",
                table: "Courses",
                column: "TeacherID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Users_StudentID",
                table: "Grades",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Student_Users_UserID",
                table: "Student",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teacher_Users_UserID",
                table: "Teacher",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
