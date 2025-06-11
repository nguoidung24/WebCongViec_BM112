using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Noidungcongviec
{
    public int IdNoiDungCongViec { get; set; }

    public string ValueNoiDungCongViec { get; set; } = null!;

    public float DinhMuc8h { get; set; }

    public string DonVi { get; set; } = null!;

    public double KhoiLuongTheoHopDong { get; set; }

    public virtual ICollection<Chamcong> Chamcongs { get; set; } = new List<Chamcong>();
}
