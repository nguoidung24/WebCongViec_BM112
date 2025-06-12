using System.Globalization;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class DataPhatSinh
    {
        public string name { get; set; }
        public Dictionary<string, List<Phatsinh>> data { get; set; }

    }

    public class PhatSinhService : BaseService
    {
        public Object dsNhanSu()
        {
            var dsNhanSu = this.DbContext.Nhansus
                .Select(n => new { n.IdNhanSu, n.HoTenNhanSu })
                .ToList();

            return dsNhanSu;
        }

        public bool themPhatSinh(List<int> IdNhanSu, Phatsinh phatSinh)
        {
            foreach (var id in IdNhanSu)
            {
                this.DbContext.Phatsinhs.Add(new Phatsinh
                {
                    IdNhanSu = id,
                    NoiDungPhatSinh = phatSinh.NoiDungPhatSinh,
                    GiaTriPhatSinh = phatSinh.GiaTriPhatSinh,
                    KieuPhatSinh = phatSinh.KieuPhatSinh,
                    LoaiPhatSinh = phatSinh.LoaiPhatSinh,
                    NgayTinhPhatSinh = phatSinh.NgayTinhPhatSinh
                }); 
            }
            this.DbContext.SaveChanges();
            return true;
        }

        public bool xoaPhatSinh(int idPhatSinh)
        {
            var phatSinh = this.DbContext.Phatsinhs.Find(idPhatSinh);
            if (phatSinh != null)
            {
                this.DbContext.Phatsinhs.Remove(phatSinh);
                this.DbContext.SaveChanges();
                return true;
            }
            return false;
        }

        public Dictionary<int, DataPhatSinh> TatCaPhatSinh()
        {
            var result = new Dictionary<int, DataPhatSinh>();
            var dsPhatSinh =  this.DbContext.Phatsinhs.ToList();
            var dsNgayPhatSinh = this.DbContext.Phatsinhs
                .Select(p => p.NgayTinhPhatSinh)
                .Distinct() 
                .AsEnumerable() 
                .Select(date => date.ToString("dd-MM-yyyy"))
                .ToList();

            var dsNhanSu = this.DbContext.Nhansus.ToList();
            foreach (var nhanSu in dsNhanSu)
            {
                var dataPhatSinh = new DataPhatSinh
                {
                    name = nhanSu.HoTenNhanSu,
                    data = new Dictionary<string, List<Phatsinh>>()
                };
                var phatSinhsCuaNhanSu = dsPhatSinh.Where(p => p.IdNhanSu == nhanSu.IdNhanSu).ToList();
                
                foreach (var phatSinh in phatSinhsCuaNhanSu)
                {
                    var ngayTinhPhatSinh = phatSinh.NgayTinhPhatSinh.ToString("dd-MM-yyyy");
                    if (!dataPhatSinh.data.ContainsKey(ngayTinhPhatSinh))
                    {
                        dataPhatSinh.data[ngayTinhPhatSinh] = new List<Phatsinh>();
                    }
                    dataPhatSinh.data[ngayTinhPhatSinh].Add(phatSinh);
                }
                result[nhanSu.IdNhanSu] = dataPhatSinh;
            }

            foreach (var ngayPhatSinh in dsNgayPhatSinh)
            {
                foreach (var dataPhatSinh in result.Values)
                {
                    if (!dataPhatSinh.data.ContainsKey(ngayPhatSinh))
                    {
                        dataPhatSinh.data.Add(ngayPhatSinh, new List<Phatsinh>() { });
                    }
                }
            }

            foreach (var tc in result.Keys)
            {
                result[tc].data = result[tc].data
                    .OrderByDescending(kvp => DateTime.ParseExact(kvp.Key, "dd-MM-yyyy", CultureInfo.InvariantCulture))
                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            return result;
        }
    }
}
