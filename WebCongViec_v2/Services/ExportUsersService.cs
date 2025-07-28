using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class ExportUsersService : BaseService
    {
        public List<int> getAllUsers()
        {
            return this.DbContext.Nhansus
                                 .Select(ns => ns.IdNhanSu).ToList();
        }
    }
}
