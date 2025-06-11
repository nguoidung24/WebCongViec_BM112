using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services.UsersService
{
    public class HomeUsersService : BaseService
    {

        public List<Chamcong> BangCongUser(string id)
        {
            return this.DbContext.Chamcongs
                .Where(row => row.IdNhanSu.ToString().Equals(id))
                .Where(row => row.Status == 1)
                .Where(row => row.IdNoiDungCongViec != 0)
                .Where(row => row.IdLoaiCongViec != 0)
                .Include(row => row.IdLoaiCongViecNavigation)
                .Include(row => row.IdNoiDungCongViecNavigation)
                .OrderBy(row => row.NgayThiCong)
                .ToList();
        }
    }
}
