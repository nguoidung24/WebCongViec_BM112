using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class AdminChamCongService : BaseService
    {

        public List<DbWebChamCongV3> getDSChamCongBu()
        {
            return this.DbContext.DbWebChamCongV3s.Where(row => row.Id.StartsWith("_cham_cong_lai_")).ToList();
        }

        public Dictionary<string, string> getDSNhanSu()
        {
            var reslut = new Dictionary<string, string>();

            var dsNhanSu = this.DbContext.Nhansus.ToList();
            foreach (var d in dsNhanSu)
            {
                reslut.Add(d.IdNhanSu.ToString(), d.HoTenNhanSu.ToString());
            }

            return reslut;
        }

        public bool setChamLaiCong(string id, string date)
        {
            try
            {
                var item = new DbWebChamCongV3()
                {
                    Id = id,
                    Data = date
                };
                this.DbContext.DbWebChamCongV3s.Add(item);
                this.DbContext.SaveChanges();
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public bool unSetChamLaiCong(string id, string date)
        {
            var item = this.DbContext.DbWebChamCongV3s.Where(row => row.Id.Equals(id) && row.Data.Equals(date)).FirstOrDefault();
            try
            {
                if (item != null)
                {
                    this.DbContext.DbWebChamCongV3s.Remove(item);
                    this.DbContext.SaveChanges();
                    return true;
                }
            }
            catch (Exception)
            {

            }
            return false;
        }
    }
}
