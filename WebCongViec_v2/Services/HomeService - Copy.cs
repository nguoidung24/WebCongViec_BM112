//using ClosedXML.Excel;
//using Microsoft.EntityFrameworkCore;
//using WebCongViec_v2.Models;

//namespace WebCongViec_v2.Services
//{
//    public class HomeService : BaseService
//    {
//        public List<Nhansu> DSNhanSu()
//        {
//            var result = this.DbContext.Nhansus.ToList();
//            return result;
//        }


//        public List<Congviec> DSCongViec()
//        {
//            var result = this.DbContext.Congviecs.OrderBy(row => row.IdCongViec).Where(row => row.IdCongViec != 0).ToList();
//            return result;
//        }

//        public Dictionary<string, Dictionary<int, List<Chamcong>>> DLChamCong(List<Nhansu> DSNhanSu)
//        {
//            var DSNgayThiCong = this.DbContext.Chamcongs
//                .Where(row => row.Status == 1)
//                .GroupBy(order => order.NgayThiCong)
//                .Select(group => new
//                {
//                    NgayThiCong = group.Key
//                }).ToList();
//            var result = new Dictionary<string, Dictionary<int, List<Chamcong>>>();

//            foreach (var ngaThiCong in DSNgayThiCong)
//            {
//                result.Add($"{ngaThiCong.NgayThiCong.ToString("dd/MM/yyyy")}", this.DSNgayCong(DSNhanSu, ngaThiCong.NgayThiCong));
//            }

//            return result;
//        }

//        Dictionary<int, List<Chamcong>> DSNgayCong(List<Nhansu> DSNhanSu, DateOnly NgayThiCong)
//        {
//            var result = new Dictionary<int, List<Chamcong>> (); 
//            var ChamCong = this.DbContext.Chamcongs
//                .Where( row => row.NgayThiCong == NgayThiCong) 
//                .Where(row => row.Status == 1)
//                .OrderBy(row => row.IdCongViec)
//                .Include(row => row.IdLoaiCongViecNavigation)
//                .Include(row => row.IdNoiDungCongViecNavigation)
//                .Include(row => row.IdCongViecNavigation)
//                .ToList();

//            foreach(var nhanSu in DSNhanSu)
//            {
//                var findNhanSu = ChamCong.Where(row => row.IdNhanSu == nhanSu.IdNhanSu).ToList();
//                if (findNhanSu.Count > 0) 
//                {
//                    result.Add(nhanSu.IdNhanSu, findNhanSu);
//                }
//                else
//                {
//                    result.Add(nhanSu.IdNhanSu, this.CongMau(nhanSu.IdNhanSu));
//                }
//            }

//            return result;
//        }

//        List<Chamcong> CongMau(int idNhanSu)
//        {
//            var result = new List<Chamcong>();
//            var DSCongViec = this.DbContext.Congviecs.Where(row => row.IdCongViec != 0).ToList();
//            foreach (var CV in DSCongViec)
//            {
//                result.Add(new Chamcong()
//                {
//                    IdChamCong = -1,
//                    IdNoiDungCongViec = -1, 
//                    IdLoaiCongViec = -1,
//                    IdCongViec = -1,
//                    IdNhanSu = idNhanSu,
//                    KhoiLuong = "",
//                    ThoiGian = "", 
                    
//                });
//            }

//            return result;
//        }
//    }
//}
