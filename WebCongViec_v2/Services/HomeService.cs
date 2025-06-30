using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{

    public class DataThoiGianChamCong
    {
        public string name;
        public Dictionary<string, Dictionary<string, List<Chamcong>>> data;
    }

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



            public Dictionary<int, DataThoiGianChamCong> LayNangSuat(DateOnly tuNgay, DateOnly denNgay)
            {
                var allNhansus = this.DbContext.Nhansus.ToDictionary(ns => ns.IdNhanSu, ns => ns.HoTenNhanSu);

                var dsCong = this.DbContext.Chamcongs
                    .Include(c => c.IdLoaiCongViecNavigation)
                    .Include(c => c.IdNhanSuNavigation)
                    .Include(c => c.IdNoiDungCongViecNavigation)
                    .Include(c => c.IdCongViecNavigation)
                    .Where(c => c.NgayThiCong >= tuNgay && c.NgayThiCong <= denNgay)
                    .Where(c => c.Status == 1)
                    .ToList();

                DateTime overallMinDate = DateTime.MaxValue;
                DateTime overallMaxDate = DateTime.MinValue;

                var allUniqueCongViecNames = new HashSet<string>();

                if (dsCong.Any())
                {
                    overallMinDate = dsCong.Min(c => c.NgayThiCong.ToDateTime(TimeOnly.MinValue)); // Chuyển DateOnly sang DateTime
                    overallMaxDate = dsCong.Max(c => c.NgayThiCong.ToDateTime(TimeOnly.MinValue)); // Chuyển DateOnly sang DateTime

                    foreach (var cong in dsCong)
                    {
                        allUniqueCongViecNames.Add(cong.IdCongViecNavigation.ValueCongViec);
                    }
                }
                else
                {
                    return new Dictionary<int, DataThoiGianChamCong>();
                }

                var aggregatedData = new Dictionary<int, Dictionary<string, Dictionary<string, List<Chamcong>>>>();

                foreach (var cong in dsCong)
                {
                    string tenCongViec = cong.IdCongViecNavigation.ValueCongViec;
                    string ngayThiCongFormatted = cong.NgayThiCong.ToString("dd-MM-yyyy");

                    if (!aggregatedData.ContainsKey(cong.IdNhanSu))
                    {
                        aggregatedData.Add(cong.IdNhanSu, new Dictionary<string, Dictionary<string, List<Chamcong>>>());
                    }

                    if (!aggregatedData[cong.IdNhanSu].ContainsKey(tenCongViec))
                    {
                        aggregatedData[cong.IdNhanSu].Add(tenCongViec, new Dictionary<string, List<Chamcong>>());
                    }

                    if (!aggregatedData[cong.IdNhanSu][tenCongViec].ContainsKey(ngayThiCongFormatted))
                    {
                        aggregatedData[cong.IdNhanSu][tenCongViec].Add(ngayThiCongFormatted, new List<Chamcong>());
                    }
                    aggregatedData[cong.IdNhanSu][tenCongViec][ngayThiCongFormatted].Add(cong);
                }

                var finalResult = new Dictionary<int, DataThoiGianChamCong>();

                foreach (var nhanSuEntry in allNhansus) 
                {
                    var nhanSuId = nhanSuEntry.Key;
                    var nhanSuName = nhanSuEntry.Value;

                    var currentNhanSuAggregatedData = aggregatedData.GetValueOrDefault(nhanSuId,
                        new Dictionary<string, Dictionary<string, List<Chamcong>>>());

                    var synchronizedNhanSuData = new Dictionary<string, Dictionary<string, List<Chamcong>>>();

                    foreach (var uniqueCongViecName in allUniqueCongViecNames.OrderBy(name => name))
                    {
                        var congViecDataForThisNhanSu = currentNhanSuAggregatedData.GetValueOrDefault(uniqueCongViecName,
                            new Dictionary<string, List<Chamcong>>());

                        var synchronizedCongViecData = new Dictionary<string, List<Chamcong>>();

                        for (DateTime date = overallMinDate; date <= overallMaxDate; date = date.AddDays(1))
                        {
                            string formattedDate = date.ToString("dd-MM-yyyy");

                            if (congViecDataForThisNhanSu.ContainsKey(formattedDate))
                            {
                                synchronizedCongViecData.Add(formattedDate, congViecDataForThisNhanSu[formattedDate]);
                            }
                            else
                            {
                                synchronizedCongViecData.Add(formattedDate, new List<Chamcong>());
                            }
                        }
                        synchronizedNhanSuData.Add(uniqueCongViecName, synchronizedCongViecData);
                    }

                    var finalNhanSuData = new DataThoiGianChamCong
                    {
                        name = nhanSuName, 
                        data = new Dictionary<string, Dictionary<string, List<Chamcong>>>()
                    };

                    foreach (var kvp in synchronizedNhanSuData.OrderBy(kv => kv.Key)) // Sắp xếp công việc theo tên
                    {
                        finalNhanSuData.data.Add(kvp.Key, kvp.Value.OrderBy(innerKv => DateTime.ParseExact(innerKv.Key, "dd-MM-yyyy", null)) // Sắp xếp ngày
                                                                   .ToDictionary(innerKv => innerKv.Key, innerKv => innerKv.Value));
                    }
                    finalResult.Add(nhanSuId, finalNhanSuData);
                }

                return finalResult;
            }
        }
    }
