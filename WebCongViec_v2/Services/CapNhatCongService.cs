using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class CapNhatCongService : BaseService
    {
        public List<Chamcong> BangCong(DateOnly NgayThiCong, int IdNhanSu)
        {
            var result = this.DbContext.Chamcongs
                .Where(row => row.IdNhanSu == IdNhanSu)
                .Where(row => row.NgayThiCong.Day == NgayThiCong.Day && row.NgayThiCong.Month == NgayThiCong.Month && row.NgayThiCong.Year == NgayThiCong.Year)
                .Include(row => row.IdLoaiCongViecNavigation)
                .Where(row => row.Status == 1)
                .Include(row => row.IdNoiDungCongViecNavigation)
                .Include(row => row.IdCongViecNavigation)
                .Include(row => row.IdNhanSuNavigation)
                .OrderBy(row => row.IdCongViec)
                .ToList();
            return result;
        }


        public bool DeleteChamCong(DateOnly NgayThiCong, int IdNhanSu)
        {
            try
            {
                var DSChamCong = this.DbContext.Chamcongs
                    .Where(row => row.IdNhanSu == IdNhanSu)
                    .Where(row => row.Status == 1)
                    .Where(row => row.NgayThiCong.Day == NgayThiCong.Day && row.NgayThiCong.Month == NgayThiCong.Month && row.NgayThiCong.Year == NgayThiCong.Year)
                    .Include(row => row.IdLoaiCongViecNavigation)
                    .Include(row => row.IdNoiDungCongViecNavigation)
                    .Include(row => row.IdCongViecNavigation)
                    .Include(row => row.IdNhanSuNavigation)
                    .OrderBy(row => row.IdCongViec)
                    .ToList();
                var CheckDSChamCong = this.DbContext.Chamcongs
                    .Where(row => row.IdNhanSu == IdNhanSu)
                    .Where(row => row.Status == 0)
                    .Where(row => row.NgayThiCong.Day == NgayThiCong.Day && row.NgayThiCong.Month == NgayThiCong.Month && row.NgayThiCong.Year == NgayThiCong.Year)
                    .Include(row => row.IdLoaiCongViecNavigation)
                    .Include(row => row.IdNoiDungCongViecNavigation)
                    .Include(row => row.IdCongViecNavigation)
                    .Include(row => row.IdNhanSuNavigation)
                    .OrderBy(row => row.IdCongViec)
                    .ToList();
                if(CheckDSChamCong.Count > 0)
                {
                    return false;
                }
                foreach (var chamCong in DSChamCong)
                {
                    chamCong.Status = 0;
                }

                this.DbContext.SaveChanges();
                }
            catch(Exception e)
            {
                return false;
            }
            return true;
        }

        public Chamcong BangCongID(int idCong)
        {
            var result = this.DbContext.Chamcongs
                .Where(row => row.IdChamCong == idCong)
                .Include(row => row.IdLoaiCongViecNavigation)
                .Include(row => row.IdNoiDungCongViecNavigation)
                .Include(row => row.IdCongViecNavigation)
                .Where(row => row.Status == 1)
                .Include(row => row.IdNhanSuNavigation)
                .OrderBy(row => row.IdCongViec)
                .First();
            return result;
        }
    }
}
