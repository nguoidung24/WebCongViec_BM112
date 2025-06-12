using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Phatsinh
{
    public int Id { get; set; }

    public int IdNhanSu { get; set; }

    public string NoiDungPhatSinh { get; set; } = null!;

    public double GiaTriPhatSinh { get; set; }

    public int LoaiPhatSinh { get; set; }

    public DateOnly NgayTinhPhatSinh { get; set; }

    public int KieuPhatSinh { get; set; }

    public virtual Nhansu IdNhanSuNavigation { get; set; } = null!;
}
