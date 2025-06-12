using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Nhansu
{
    public int IdNhanSu { get; set; }

    public string Password { get; set; } = null!;

    public string HoTenNhanSu { get; set; } = null!;

    public string ThongTinCaNhan { get; set; } = null!;

    public int Role { get; set; }

    public int Status { get; set; }

    public string FsiThoiVu { get; set; } = null!;

    public double MucLuongCoBan8h { get; set; }

    public double MucLuongDuAn8h { get; set; }

    public float HeSoOtThuong { get; set; }

    public float HeSoCn { get; set; }

    public virtual ICollection<Chamcong> Chamcongs { get; set; } = new List<Chamcong>();

    public virtual Phatsinh? Phatsinh { get; set; }
}
