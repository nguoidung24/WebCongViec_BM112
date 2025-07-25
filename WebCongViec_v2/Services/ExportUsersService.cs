using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class ExportUsersService : BaseService
    {
        public Dictionary<int, string> getAllUsers()
        {
            return this.DbContext.Nhansus
                                 .ToDictionary(ns => ns.IdNhanSu, ns => ns.HoTenNhanSu);
        }
    }
}
