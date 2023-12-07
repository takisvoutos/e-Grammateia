using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class RegistrationCourseList : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Registration_Course_CourseID",
                table: "Registration");

            migrationBuilder.DropIndex(
                name: "IX_Registration_CourseID",
                table: "Registration");

            migrationBuilder.DropColumn(
                name: "CourseID",
                table: "Registration");

            migrationBuilder.AddColumn<int>(
                name: "RegistrationRegId",
                table: "Course",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Course_RegistrationRegId",
                table: "Course",
                column: "RegistrationRegId");

            migrationBuilder.AddForeignKey(
                name: "FK_Course_Registration_RegistrationRegId",
                table: "Course",
                column: "RegistrationRegId",
                principalTable: "Registration",
                principalColumn: "RegId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Course_Registration_RegistrationRegId",
                table: "Course");

            migrationBuilder.DropIndex(
                name: "IX_Course_RegistrationRegId",
                table: "Course");

            migrationBuilder.DropColumn(
                name: "RegistrationRegId",
                table: "Course");

            migrationBuilder.AddColumn<int>(
                name: "CourseID",
                table: "Registration",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Registration_CourseID",
                table: "Registration",
                column: "CourseID");

            migrationBuilder.AddForeignKey(
                name: "FK_Registration_Course_CourseID",
                table: "Registration",
                column: "CourseID",
                principalTable: "Course",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
