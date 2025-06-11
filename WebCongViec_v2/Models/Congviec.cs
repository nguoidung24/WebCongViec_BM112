using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Models;

public partial class Congviec
{
    public int IdCongViec { get; set; }

    public string ValueCongViec { get; set; } = null!;

    public virtual ICollection<Chamcong> Chamcongs { get; set; } = new List<Chamcong>();
}
