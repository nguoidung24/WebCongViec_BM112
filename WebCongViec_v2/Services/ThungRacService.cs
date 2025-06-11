using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class ThungRacService : BaseService
    {
        public List<Chamcong> HienThiCong()
        {

            return  this.DbContext.Chamcongs
                .Where(row => row.Status == 0)
                    .Include(row => row.IdLoaiCongViecNavigation)
                    .Include(row => row.IdNoiDungCongViecNavigation)
                    .Include(row => row.IdCongViecNavigation)
                    .Include(row => row.IdNhanSuNavigation)
                    .OrderBy(row => row.IdCongViec)
                .ToList();
        }


        public bool KhoiPhuc(int IdNhanSu, DateOnly NgayThiCong)
        {

            try
            {
                var DSChamCong1 = this.DbContext.Chamcongs
                   .Where(row => row.IdNhanSu == IdNhanSu)
                   .Where(row => row.Status == 1)
                   .Where(row => row.NgayThiCong.Day == NgayThiCong.Day && row.NgayThiCong.Month == NgayThiCong.Month && row.NgayThiCong.Year == NgayThiCong.Year)
                   .OrderBy(row => row.IdCongViec)
                   .ToList();
                if (DSChamCong1.Count > 0)
                {
                    foreach (var chamCong in DSChamCong1)
                    {
                        chamCong.Status = 0;
                    }

                }

            }catch(Exception e)
            {
                return false;
            }


            try
            {
                var DSChamCong = this.DbContext.Chamcongs
                    .Where(row => row.IdNhanSu == IdNhanSu)
                    .Where(row => row.Status == 0)
                    .Where(row => row.NgayThiCong.Day == NgayThiCong.Day && row.NgayThiCong.Month == NgayThiCong.Month && row.NgayThiCong.Year == NgayThiCong.Year)
                    .OrderBy(row => row.IdCongViec)
                    .ToList();

                foreach (var chamCong in DSChamCong)
                {
                    chamCong.Status = 1;
                }

                this.DbContext.SaveChanges();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }




        public bool XoaVinhVien(int IdNhanSu, DateOnly NgayThiCong)
        {
            try
            {
                var DSChamCong = this.DbContext.Chamcongs
                    .Where(row => row.IdNhanSu == IdNhanSu)
                    .Where(row => row.Status == 0)
                    .Where(row => row.NgayThiCong.Day == NgayThiCong.Day && row.NgayThiCong.Month == NgayThiCong.Month && row.NgayThiCong.Year == NgayThiCong.Year)
                    .OrderBy(row => row.IdCongViec)
                    .ToList();

                foreach (var chamCong in DSChamCong)
                {
                    this.DbContext.Chamcongs.Remove(chamCong);
                }

                this.DbContext.SaveChanges();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
    }
}
