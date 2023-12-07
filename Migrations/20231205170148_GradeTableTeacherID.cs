using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace e_Grammateia.Migrations
{
    public partial class GradeTableTeacherID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Secretary_UserID",
                table: "Secretary");

            migrationBuilder.AddColumn<int>(
                name: "TeacherID",
                table: "Grade",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Secretary_UserID",
                table: "Secretary",
                column: "UserID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Grade_TeacherID",
                table: "Grade",
                column: "TeacherID");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Teacher_TeacherID",
                table: "Grade",
                column: "TeacherID",
                principalTable: "Teacher",
                principalColumn: "TeacherID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Teacher_TeacherID",
                table: "Grade");

            migrationBuilder.DropIndex(
                name: "IX_Secretary_UserID",
                table: "Secretary");

            migrationBuilder.DropIndex(
                name: "IX_Grade_TeacherID",
                table: "Grade");

            migrationBuilder.DropColumn(
                name: "TeacherID",
                table: "Grade");

            migrationBuilder.CreateIndex(
                name: "IX_Secretary_UserID",
                table: "Secretary",
                column: "UserID");
        }
    }
}
