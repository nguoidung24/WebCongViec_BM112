using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Bangdutoanchiphi
{
    public string Id { get; set; } = null!;

    public string NoiDung { get; set; } = null!;

    public double DuToan { get; set; }

    public double TamUng { get; set; }

    public string NoiDungCua { get; set; } = null!;

    public double DaChi { get; set; }

    public string GhiChu { get; set; } = null!;
}
