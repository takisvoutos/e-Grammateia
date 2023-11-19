﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using e_Grammateia.Models;

#nullable disable

namespace e_Grammateia.Migrations
{
    [DbContext(typeof(GrammateiaDb))]
    [Migration("20231116154527_GradeTableFKUpdate")]
    partial class GradeTableFKUpdate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.0");

            modelBuilder.Entity("e_Grammateia.Models.Course", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Course_Type")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("DepartmentID")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ECTS")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Semester")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TeacherID")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentID");

                    b.HasIndex("TeacherID");

                    b.ToTable("Course");
                });

            modelBuilder.Entity("e_Grammateia.Models.Department", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("School")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Department");
                });

            modelBuilder.Entity("e_Grammateia.Models.Grades", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CourseID")
                        .HasColumnType("INTEGER");

                    b.Property<decimal?>("Grade")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("StudentID")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CourseID");

                    b.HasIndex("StudentID");

                    b.ToTable("Grade");
                });

            modelBuilder.Entity("e_Grammateia.Models.Student", b =>
                {
                    b.Property<int>("StudentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("DepartmentID")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("RegistrationDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("StudentNumber")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserID")
                        .HasColumnType("INTEGER");

                    b.HasKey("StudentID");

                    b.HasIndex("DepartmentID");

                    b.HasIndex("UserID")
                        .IsUnique();

                    b.ToTable("Student");
                });

            modelBuilder.Entity("e_Grammateia.Models.Teacher", b =>
                {
                    b.Property<int>("TeacherID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("DepartmentID")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UserID")
                        .HasColumnType("INTEGER");

                    b.HasKey("TeacherID");

                    b.HasIndex("DepartmentID");

                    b.HasIndex("UserID")
                        .IsUnique();

                    b.ToTable("Teacher");
                });

            modelBuilder.Entity("e_Grammateia.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Role")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("e_Grammateia.Models.Course", b =>
                {
                    b.HasOne("e_Grammateia.Models.Department", "Department")
                        .WithMany()
                        .HasForeignKey("DepartmentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("e_Grammateia.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("TeacherID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");

                    b.Navigation("User");
                });

            modelBuilder.Entity("e_Grammateia.Models.Grades", b =>
                {
                    b.HasOne("e_Grammateia.Models.Course", "Course")
                        .WithMany()
                        .HasForeignKey("CourseID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("e_Grammateia.Models.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("e_Grammateia.Models.Student", b =>
                {
                    b.HasOne("e_Grammateia.Models.Department", "Department")
                        .WithMany()
                        .HasForeignKey("DepartmentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("e_Grammateia.Models.User", "User")
                        .WithOne("Student")
                        .HasForeignKey("e_Grammateia.Models.Student", "UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");

                    b.Navigation("User");
                });

            modelBuilder.Entity("e_Grammateia.Models.Teacher", b =>
                {
                    b.HasOne("e_Grammateia.Models.Department", "Department")
                        .WithMany()
                        .HasForeignKey("DepartmentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("e_Grammateia.Models.User", "User")
                        .WithOne("Teacher")
                        .HasForeignKey("e_Grammateia.Models.Teacher", "UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");

                    b.Navigation("User");
                });

            modelBuilder.Entity("e_Grammateia.Models.User", b =>
                {
                    b.Navigation("Student")
                        .IsRequired();

                    b.Navigation("Teacher")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
