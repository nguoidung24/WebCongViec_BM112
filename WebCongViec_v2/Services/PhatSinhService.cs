using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class PhatSinhService : BaseService
    {
        public Object dsNhanSu()
        {
            var dsNhanSu = this.DbContext.Nhansus
                .Where(n => n.Status == 1)
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
                    LoaiPhatSinh = phatSinh.LoaiPhatSinh,
                    NgayTinhPhatSinh = phatSinh.NgayTinhPhatSinh
                }); 
            }
            this.DbContext.SaveChanges();
            return true;
        }
    }
}
