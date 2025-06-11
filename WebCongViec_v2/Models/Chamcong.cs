using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Chamcong
{
    public int IdChamCong { get; set; }

    public int IdNhanSu { get; set; }

    public int IdCongViec { get; set; }

    public int IdLoaiCongViec { get; set; }

    public int IdNoiDungCongViec { get; set; }

    public DateOnly NgayThiCong { get; set; }

    public string ThoiGian { get; set; } = null!;

    public string KhoiLuong { get; set; } = null!;

    public int Status { get; set; }

    public virtual Congviec IdCongViecNavigation { get; set; } = null!;

    public virtual Loaicongviec IdLoaiCongViecNavigation { get; set; } = null!;

    public virtual Nhansu IdNhanSuNavigation { get; set; } = null!;

    public virtual Noidungcongviec IdNoiDungCongViecNavigation { get; set; } = null!;
}
