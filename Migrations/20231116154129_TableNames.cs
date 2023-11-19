using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class TableNames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Departments_DepartmentID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_User_TeacherID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Courses_CourseID",
                table: "Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_Grades_User_StudentID",
                table: "Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_Student_Departments_DepartmentID",
                table: "Student");

            migrationBuilder.DropForeignKey(
                name: "FK_Teacher_Departments_DepartmentID",
                table: "Teacher");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Grades",
                table: "Grades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Departments",
                table: "Departments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Courses",
                table: "Courses");

            migrationBuilder.RenameTable(
                name: "Grades",
                newName: "Grade");

            migrationBuilder.RenameTable(
                name: "Departments",
                newName: "Department");

            migrationBuilder.RenameTable(
                name: "Courses",
                newName: "Course");

            migrationBuilder.RenameIndex(
                name: "IX_Grades_StudentID",
                table: "Grade",
                newName: "IX_Grade_StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_Grades_CourseID",
                table: "Grade",
                newName: "IX_Grade_CourseID");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_TeacherID",
                table: "Course",
                newName: "IX_Course_TeacherID");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_DepartmentID",
                table: "Course",
                newName: "IX_Course_DepartmentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Grade",
                table: "Grade",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Department",
                table: "Department",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Course",
                table: "Course",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Course_Department_DepartmentID",
                table: "Course",
                column: "DepartmentID",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Course_User_TeacherID",
                table: "Course",
                column: "TeacherID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Course_CourseID",
                table: "Grade",
                column: "CourseID",
                principalTable: "Course",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_User_StudentID",
                table: "Grade",
                column: "StudentID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Student_Department_DepartmentID",
                table: "Student",
                column: "DepartmentID",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teacher_Department_DepartmentID",
                table: "Teacher",
                column: "DepartmentID",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Course_Department_DepartmentID",
                table: "Course");

            migrationBuilder.DropForeignKey(
                name: "FK_Course_User_TeacherID",
                table: "Course");

            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Course_CourseID",
                table: "Grade");

            migrationBuilder.DropForeignKey(
                name: "FK_Grade_User_StudentID",
                table: "Grade");

            migrationBuilder.DropForeignKey(
                name: "FK_Student_Department_DepartmentID",
                table: "Student");

            migrationBuilder.DropForeignKey(
                name: "FK_Teacher_Department_DepartmentID",
                table: "Teacher");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Grade",
                table: "Grade");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Department",
                table: "Department");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Course",
                table: "Course");

            migrationBuilder.RenameTable(
                name: "Grade",
                newName: "Grades");

            migrationBuilder.RenameTable(
                name: "Department",
                newName: "Departments");

            migrationBuilder.RenameTable(
                name: "Course",
                newName: "Courses");

            migrationBuilder.RenameIndex(
                name: "IX_Grade_StudentID",
                table: "Grades",
                newName: "IX_Grades_StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_Grade_CourseID",
                table: "Grades",
                newName: "IX_Grades_CourseID");

            migrationBuilder.RenameIndex(
                name: "IX_Course_TeacherID",
                table: "Courses",
                newName: "IX_Courses_TeacherID");

            migrationBuilder.RenameIndex(
                name: "IX_Course_DepartmentID",
                table: "Courses",
                newName: "IX_Courses_DepartmentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Grades",
                table: "Grades",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Departments",
                table: "Departments",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Courses",
                table: "Courses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Departments_DepartmentID",
                table: "Courses",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_User_TeacherID",
                table: "Courses",
                column: "TeacherID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Courses_CourseID",
                table: "Grades",
                column: "CourseID",
                principalTable: "Courses",
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
                name: "FK_Student_Departments_DepartmentID",
                table: "Student",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teacher_Departments_DepartmentID",
                table: "Teacher",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
