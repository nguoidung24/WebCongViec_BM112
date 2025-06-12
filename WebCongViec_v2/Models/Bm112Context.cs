using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using System;
using System.Collections.Generic;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Models;

public partial class Bm112Context : DbContext
{
    public Bm112Context()
    {
    }

    public Bm112Context(DbContextOptions<Bm112Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Bangdutoanchiphi> Bangdutoanchiphis { get; set; }

    public virtual DbSet<Chamcong> Chamcongs { get; set; }

    public virtual DbSet<Congviec> Congviecs { get; set; }

    public virtual DbSet<DbWebChamCongV3> DbWebChamCongV3s { get; set; }

    public virtual DbSet<Loaicongviec> Loaicongviecs { get; set; }

    public virtual DbSet<Nhansu> Nhansus { get; set; }

    public virtual DbSet<Noidungcongviec> Noidungcongviecs { get; set; }

    public virtual DbSet<Phatsinh> Phatsinhs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseMySql(ConnectStringService.Get(), Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.32-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Bangdutoanchiphi>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("bangdutoanchiphi");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DaChi).HasColumnName("da_chi");
            entity.Property(e => e.DuToan).HasColumnName("du_toan");
            entity.Property(e => e.GhiChu)
                .HasColumnType("text")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.NoiDung)
                .HasColumnType("text")
                .HasColumnName("noi_dung");
            entity.Property(e => e.NoiDungCua)
                .HasMaxLength(255)
                .HasDefaultValueSql("'0'")
                .HasColumnName("noi_dung_cua");
            entity.Property(e => e.TamUng).HasColumnName("tam_ung");
        });

        modelBuilder.Entity<Chamcong>(entity =>
        {
            entity.HasKey(e => e.IdChamCong).HasName("PRIMARY");

            entity.ToTable("chamcong");

            entity.HasIndex(e => new { e.IdCongViec, e.IdLoaiCongViec, e.IdNoiDungCongViec }, "id_cong_viec");

            entity.HasIndex(e => e.IdLoaiCongViec, "id_loai_cong_viec");

            entity.HasIndex(e => e.IdNhanSu, "id_nhan_su");

            entity.HasIndex(e => e.IdNoiDungCongViec, "id_noi_dung_cong_viec");

            entity.Property(e => e.IdChamCong)
                .HasColumnType("int(11)")
                .HasColumnName("id_cham_cong");
            entity.Property(e => e.IdCongViec)
                .HasColumnType("int(11)")
                .HasColumnName("id_cong_viec");
            entity.Property(e => e.IdLoaiCongViec)
                .HasColumnType("int(11)")
                .HasColumnName("id_loai_cong_viec");
            entity.Property(e => e.IdNhanSu)
                .HasColumnType("int(11)")
                .HasColumnName("id_nhan_su");
            entity.Property(e => e.IdNoiDungCongViec)
                .HasColumnType("int(11)")
                .HasColumnName("id_noi_dung_cong_viec");
            entity.Property(e => e.KhoiLuong)
                .HasMaxLength(255)
                .HasColumnName("khoi_luong");
            entity.Property(e => e.NgayThiCong).HasColumnName("ngay_thi_cong");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'1'")
                .HasColumnType("int(11)")
                .HasColumnName("status");
            entity.Property(e => e.ThoiGian)
                .HasMaxLength(255)
                .HasColumnName("thoi_gian");

            entity.HasOne(d => d.IdCongViecNavigation).WithMany(p => p.Chamcongs)
                .HasForeignKey(d => d.IdCongViec)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chamcong_ibfk_3");

            entity.HasOne(d => d.IdLoaiCongViecNavigation).WithMany(p => p.Chamcongs)
                .HasForeignKey(d => d.IdLoaiCongViec)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chamcong_ibfk_2");

            entity.HasOne(d => d.IdNhanSuNavigation).WithMany(p => p.Chamcongs)
                .HasForeignKey(d => d.IdNhanSu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chamcong_ibfk_1");

            entity.HasOne(d => d.IdNoiDungCongViecNavigation).WithMany(p => p.Chamcongs)
                .HasForeignKey(d => d.IdNoiDungCongViec)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chamcong_ibfk_4");
        });

        modelBuilder.Entity<Congviec>(entity =>
        {
            entity.HasKey(e => e.IdCongViec).HasName("PRIMARY");

            entity.ToTable("congviec");

            entity.Property(e => e.IdCongViec)
                .HasColumnType("int(11)")
                .HasColumnName("id_cong_viec");
            entity.Property(e => e.ValueCongViec)
                .HasMaxLength(255)
                .HasColumnName("value_cong_viec");
        });

        modelBuilder.Entity<DbWebChamCongV3>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("db_web_cham_cong_v3");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Data)
                .HasColumnType("text")
                .HasColumnName("data");
        });

        modelBuilder.Entity<Loaicongviec>(entity =>
        {
            entity.HasKey(e => e.IdLoaiCongViec).HasName("PRIMARY");

            entity.ToTable("loaicongviec");

            entity.Property(e => e.IdLoaiCongViec)
                .HasColumnType("int(11)")
                .HasColumnName("id_loai_cong_viec");
            entity.Property(e => e.ValueLoaiCongViec)
                .HasMaxLength(255)
                .HasColumnName("value_loai_cong_viec");
        });

        modelBuilder.Entity<Nhansu>(entity =>
        {
            entity.HasKey(e => e.IdNhanSu).HasName("PRIMARY");

            entity.ToTable("nhansu");

            entity.Property(e => e.IdNhanSu)
                .ValueGeneratedNever()
                .HasColumnType("int(11)")
                .HasColumnName("id_nhan_su");
            entity.Property(e => e.FsiThoiVu)
                .HasMaxLength(255)
                .HasColumnName("fsi_thoi_vu");
            entity.Property(e => e.HeSoCn).HasColumnName("he_so_cn");
            entity.Property(e => e.HeSoOtThuong).HasColumnName("he_so_ot_thuong");
            entity.Property(e => e.HoTenNhanSu)
                .HasMaxLength(255)
                .HasColumnName("ho_ten_nhan_su");
            entity.Property(e => e.MucLuongCoBan8h).HasColumnName("muc_luong_co_ban_8h");
            entity.Property(e => e.MucLuongDuAn8h).HasColumnName("muc_luong_du_an_8h");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasDefaultValueSql("'12345678'")
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasDefaultValueSql("'3'")
                .HasColumnType("int(11)")
                .HasColumnName("role");
            entity.Property(e => e.Status)
                .HasColumnType("int(11)")
                .HasColumnName("status");
            entity.Property(e => e.ThongTinCaNhan)
                .HasColumnType("text")
                .HasColumnName("thong_tin_ca_nhan");
        });

        modelBuilder.Entity<Noidungcongviec>(entity =>
        {
            entity.HasKey(e => e.IdNoiDungCongViec).HasName("PRIMARY");

            entity.ToTable("noidungcongviec");

            entity.Property(e => e.IdNoiDungCongViec)
                .HasColumnType("int(11)")
                .HasColumnName("id_noi_dung_cong_viec");
            entity.Property(e => e.DinhMuc8h).HasColumnName("dinh_muc_8h");
            entity.Property(e => e.DonVi)
                .HasMaxLength(255)
                .HasColumnName("don_vi");
            entity.Property(e => e.KhoiLuongTheoHopDong).HasColumnName("khoi_luong_theo_hop_dong");
            entity.Property(e => e.ValueNoiDungCongViec)
                .HasMaxLength(255)
                .HasColumnName("value_noi_dung_cong_viec");
        });

        modelBuilder.Entity<Phatsinh>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("phatsinh");

            entity.HasIndex(e => e.IdNhanSu, "id_nhan_su").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.GiaTriPhatSinh).HasColumnName("gia_tri_phat_sinh");
            entity.Property(e => e.IdNhanSu)
                .HasColumnType("int(11)")
                .HasColumnName("id_nhan_su");
            entity.Property(e => e.LoaiPhatSinh)
                .HasColumnType("int(11)")
                .HasColumnName("loai_phat_sinh");
            entity.Property(e => e.NgayTinhPhatSinh).HasColumnName("ngay_tinh_phat_sinh");
            entity.Property(e => e.NoiDungPhatSinh)
                .HasMaxLength(255)
                .HasColumnName("noi_dung_phat_sinh");

            entity.HasOne(d => d.IdNhanSuNavigation).WithOne(p => p.Phatsinh)
                .HasForeignKey<Phatsinh>(d => d.IdNhanSu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("phatsinh_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
