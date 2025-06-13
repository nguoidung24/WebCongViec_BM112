using Microsoft.EntityFrameworkCore;
using System;
using System.Globalization;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    //name = "Nguyễn Văn A",
    //            data = new Dictionary<string, string>
    //            {
    //                { "2003-10-12", "1233" },
    //                { "2003-10-13", "142" },
    //            }

    public class DataTraCuu
    {
        public string name { get; set; }
        public Dictionary<string, int> data { get; set; }
    }
            
    public class TraCuuService : BaseService
    {

        public List<Noidungcongviec> layNoiDungCongViec()
        {
            return this.DbContext.Noidungcongviecs.Where(nd => nd.IdNoiDungCongViec != 0).ToList();
        }

        public Dictionary<int, DataTraCuu> getData(DateOnly startDate, DateOnly endDate, int jobId, string typeId)
        {
            var dataTraCuu = new Dictionary<int, DataTraCuu>();

            var _dsCong = this.DbContext.Chamcongs
                .Include(c => c.IdNhanSuNavigation)
                .Where(c => c.Status == 1)
                .Where(c => c.NgayThiCong >= startDate && c.NgayThiCong <= endDate)
                .Where(c => c.IdNoiDungCongViec == jobId);
                if (!"ALL".Equals(typeId))
                {
                    _dsCong = _dsCong.Where(c => c.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith(typeId));
                }

            var dsCong = _dsCong.ToList();

            var dsNgayThiCong = this.DbContext.Chamcongs
                .Where(c => c.Status == 1)
                .Where(c => c.NgayThiCong >= startDate && c.NgayThiCong <= endDate)
                .GroupBy(c => c.NgayThiCong)
                .ToList();

            foreach (var c in dsCong)
            {
                if (!dataTraCuu.ContainsKey(c.IdNhanSu))
                {
                    dataTraCuu.Add
                        (
                            c.IdNhanSu,
                            new DataTraCuu()
                            {
                                name = c.IdNhanSuNavigation.HoTenNhanSu,
                                data = new Dictionary<string, int>() {
                                    {
                                        c.NgayThiCong.ToString("dd/MM/yyyy"),
                                        int.Parse(c.KhoiLuong)
                                    }
                                }
                            }

                        );
                }
                else
                {
                    if (!dataTraCuu[c.IdNhanSu].data.ContainsKey(c.NgayThiCong.ToString("dd/MM/yyyy")) )
                    {
                        dataTraCuu[c.IdNhanSu].data.Add(c.NgayThiCong.ToString("dd/MM/yyyy"), int.Parse(c.KhoiLuong));
                    }
                    else
                    {
                        dataTraCuu[c.IdNhanSu].data[c.NgayThiCong.ToString("dd/MM/yyyy")] += int.Parse(c.KhoiLuong);
                    }
                }
            }

            foreach(var ngay in dsNgayThiCong)
            {
                foreach (var item in dataTraCuu)
                {
                    if (!item.Value.data.ContainsKey(ngay.Key.ToString("dd/MM/yyyy")))
                    {
                        item.Value.data.Add(ngay.Key.ToString("dd/MM/yyyy"), 0);
                    }
                }
            }


            foreach(var tc in dataTraCuu.Keys)
            {
                dataTraCuu[tc].data = dataTraCuu[tc].data
                    .OrderBy(kvp => DateTime.ParseExact(kvp.Key, "dd/MM/yyyy", CultureInfo.InvariantCulture))
                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            return dataTraCuu;

        }
    }
}

