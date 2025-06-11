using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Loaicongviec
{
    public int IdLoaiCongViec { get; set; }

    public string ValueLoaiCongViec { get; set; } = null!;

    public virtual ICollection<Chamcong> Chamcongs { get; set; } = new List<Chamcong>();
}
