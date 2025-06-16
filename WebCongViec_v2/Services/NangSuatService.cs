using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;
using System.Linq;
using System;
using System.Collections.Generic;

namespace WebCongViec_v2.Services
{
    public class DataNangSuat
    {
        public string name;
        public Dictionary<string, Dictionary<string, List<Chamcong>>> data;
    }

    public class NangSuatService : BaseService
    {
        public Dictionary<int, DataNangSuat> LayNangSuat(DateOnly tuNgay, DateOnly denNgay)
        {
            // Lấy danh sách tất cả nhân sự từ DB một lần
            var allNhansus = this.DbContext.Nhansus.ToDictionary(ns => ns.IdNhanSu, ns => ns.HoTenNhanSu);

            // Lấy tất cả các bản ghi chấm công có status = 1
            var dsCong = this.DbContext.Chamcongs
                .Include(c => c.IdLoaiCongViecNavigation)
                .Include(c => c.IdNhanSuNavigation)
                .Include(c => c.IdNoiDungCongViecNavigation)
                .Include(c => c.IdCongViecNavigation)
                .Where(c => c.NgayThiCong >= tuNgay && c.NgayThiCong <= denNgay)
                .Where(c => c.Status == 1)
                .ToList();

            // 1. Xác định khoảng thời gian chung (từ ngày sớm nhất đến ngày muộn nhất)
            // Sử dụng DateTime để nhất quán trong việc so sánh và sắp xếp
            DateTime overallMinDate = DateTime.MaxValue;
            DateTime overallMaxDate = DateTime.MinValue;

            // 2. Lấy tất cả các loại công việc duy nhất có trong dữ liệu
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
                // Nếu không có dữ liệu chấm công nào, bạn cần quyết định khoảng ngày mặc định là gì.
                // Ví dụ: từ đầu tháng hiện tại đến cuối tháng hiện tại, hoặc chỉ trả về rỗng.
                // Ở đây, tôi sẽ trả về rỗng nếu không có chấm công nào để xác định khoảng thời gian.
                return new Dictionary<int, DataNangSuat>();
            }

            // 3. Tổng hợp dữ liệu chấm công thực tế vào một cấu trúc tạm thời
            // Key: IdNhanSu, Value: Dictionary<TenCongViec, Dictionary<NgayThiCong_Formatted, List<Chamcong>>>
            var aggregatedData = new Dictionary<int, Dictionary<string, Dictionary<string, List<Chamcong>>>>();

            foreach (var cong in dsCong)
            {
                string tenCongViec = cong.IdCongViecNavigation.ValueCongViec;
                string ngayThiCongFormatted = cong.NgayThiCong.ToString("dd-MM-yyyy");

                // Đảm bảo aggregatedData có IdNhanSu
                if (!aggregatedData.ContainsKey(cong.IdNhanSu))
                {
                    aggregatedData.Add(cong.IdNhanSu, new Dictionary<string, Dictionary<string, List<Chamcong>>>());
                }

                // Đảm bảo có TenCongViec cho IdNhanSu này
                if (!aggregatedData[cong.IdNhanSu].ContainsKey(tenCongViec))
                {
                    aggregatedData[cong.IdNhanSu].Add(tenCongViec, new Dictionary<string, List<Chamcong>>());
                }

                // Đảm bảo có NgayThiCong cho TenCongViec này
                if (!aggregatedData[cong.IdNhanSu][tenCongViec].ContainsKey(ngayThiCongFormatted))
                {
                    aggregatedData[cong.IdNhanSu][tenCongViec].Add(ngayThiCongFormatted, new List<Chamcong>());
                }
                aggregatedData[cong.IdNhanSu][tenCongViec][ngayThiCongFormatted].Add(cong);
            }

            // 4. Đồng bộ hóa ngày và điền dữ liệu mặc định cho TẤT CẢ nhân sự
            var finalResult = new Dictionary<int, DataNangSuat>();

            foreach (var nhanSuEntry in allNhansus) // Lặp qua TẤT CẢ nhân sự trong hệ thống
            {
                var nhanSuId = nhanSuEntry.Key;
                var nhanSuName = nhanSuEntry.Value;

                var currentNhanSuAggregatedData = aggregatedData.GetValueOrDefault(nhanSuId,
                    new Dictionary<string, Dictionary<string, List<Chamcong>>>());

                var synchronizedNhanSuData = new Dictionary<string, Dictionary<string, List<Chamcong>>>();

                // 4.1. Duyệt qua tất cả các loại công việc duy nhất đã được tìm thấy
                foreach (var uniqueCongViecName in allUniqueCongViecNames.OrderBy(name => name))
                {
                    var congViecDataForThisNhanSu = currentNhanSuAggregatedData.GetValueOrDefault(uniqueCongViecName,
                        new Dictionary<string, List<Chamcong>>());

                    var synchronizedCongViecData = new Dictionary<string, List<Chamcong>>();

                    // 4.2. Duyệt qua tất cả các ngày trong khoảng thời gian chung
                    for (DateTime date = overallMinDate; date <= overallMaxDate; date = date.AddDays(1))
                    {
                        string formattedDate = date.ToString("dd-MM-yyyy");

                        if (congViecDataForThisNhanSu.ContainsKey(formattedDate))
                        {
                            // Nếu có dữ liệu thực tế cho ngày này và công việc này, thêm vào
                            synchronizedCongViecData.Add(formattedDate, congViecDataForThisNhanSu[formattedDate]);
                        }
                        else
                        {
                            // Nếu không có dữ liệu, thêm một List<Chamcong> rỗng làm mặc định
                            // Bạn có thể cân nhắc tạo một Chamcong "giả" với giá trị mặc định nếu cần
                            synchronizedCongViecData.Add(formattedDate, new List<Chamcong>());
                        }
                    }
                    synchronizedNhanSuData.Add(uniqueCongViecName, synchronizedCongViecData);
                }

                // Sắp xếp lại dữ liệu ngày trong từng công việc sau khi đã đồng bộ
                var finalNhanSuData = new DataNangSuat
                {
                    name = nhanSuName, // Sử dụng tên nhân sự từ danh sách allNhansus
                    data = new Dictionary<string, Dictionary<string, List<Chamcong>>>()
                };

                // Đảm bảo thứ tự công việc và ngày được sắp xếp
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