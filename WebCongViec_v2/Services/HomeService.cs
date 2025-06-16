using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class HomeService : BaseService
    {
        public int TongSoNhanSu()
        {
            return this.DbContext.Nhansus.ToList().Count;
        }

        public int DaChamCongHomNay(DateOnly currentDate)
        {
            return this.DbContext.Chamcongs
                .Where(cc => cc.NgayThiCong == currentDate)
                .Where(cc => cc.Status == 1)
                .GroupBy(cc => cc.IdNhanSu)
                .ToList().Count;
        }
        public double NangSuatHomNay(DateOnly currentDate)
        {
            var chamCongHomNay = this.DbContext.Chamcongs
                .Where(cc => cc.NgayThiCong == currentDate)
                .Where(cc => cc.Status == 1)
                .Where(cc => cc.KhoiLuong != null && cc.KhoiLuong != "")
                .ToList();
            double tongNangSuat = 0;
            foreach (var chamCong in chamCongHomNay)
            {
                tongNangSuat += double.Parse(chamCong.KhoiLuong);
            }
            return tongNangSuat;
        }

        public List<Chamcong> DSChamCongHomNay(DateOnly currentDate)
        {
            return this.DbContext.Chamcongs
                .Where(cc => cc.NgayThiCong == currentDate)
                .Where(cc => cc.Status == 1)
                .Where(cc => cc.ThoiGian != null && cc.ThoiGian != "")
                .Include(cc => cc.IdNhanSuNavigation)
                .Include(cc => cc.IdCongViecNavigation)
                .Include(cc => cc.IdLoaiCongViecNavigation)
                .Include(cc => cc.IdNoiDungCongViecNavigation)
                .ToList();
        }
    }
}
