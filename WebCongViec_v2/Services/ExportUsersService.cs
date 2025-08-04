using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class ExportUsersService : BaseService
    {
        public Dictionary<string, List<int>> getAllUsers()
        {
            var result = new Dictionary<string, List<int>>();
            result.Add("data", this.DbContext.Nhansus
                                 .Select(ns => ns.IdNhanSu).ToList());
            return result;
        }
    }
}
