using ClosedXML.Excel;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{

    public class MyResult
    {
        public int IdNoiDungCongViec { get; set; }
        public string ValueNoiDungCongViec { get; set; }
        public string NhomLoaiCongViec { get; set; }
        public int SoLanXuatHien { get; set; }
        public int TongSoLanXuatHienNoiDung { get; set; }
        public decimal PhanTram { get; set; }
        public decimal TongKhoiLuong { get; set; }
        public decimal TongKhoiLuongNoiDung { get; set; }
    }

    public class BCTongHopService : BaseService
    {


        public void updateProjectInfo(string id, string value)
        {
            try
            {
                var a = this.DbContext.DbWebChamCongV3s.Where(n => n.Id.Equals(id)).First();
                a.Data = value;
                this.DbContext.SaveChanges();
            }
            catch (Exception e)
            {

            }
}


        public Dictionary<string, string> getProjectInfo()
        {
            var result = new Dictionary<string, string>();
            var listData = this.DbContext.DbWebChamCongV3s.ToList();
            foreach (var item in listData) {
                if (item.Id.ToString().StartsWith("TDS_"))
                {
                    result.Add(item.Id.ToString(), item.Data.ToString());
                }
            }
            return result;
        }

        public Dictionary<int, MyResult> GetDataFromDatabase(string connectionString)
        {
            var results = new Dictionary<int, MyResult>();

            // Kết nối tới cơ sở dữ liệu
            using (var conn = new MySqlConnection(connectionString))
            {
                // Câu lệnh SQL
                string query = @"
                    SELECT
                        chamcong.id_noi_dung_cong_viec,
                        noidungcongviec.value_noi_dung_cong_viec,
                        LEFT(loaicongviec.value_loai_cong_viec, 2) AS nhom_loai_cong_viec,
                        COUNT(*) AS so_lan_xuat_hien,
                        SUM(COUNT(*)) OVER (PARTITION BY chamcong.id_noi_dung_cong_viec) AS tong_so_lan_xuat_hien_noi_dung,
                        ROUND(
                            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(
                                PARTITION BY chamcong.id_noi_dung_cong_viec
                            ),
                            2
                        ) AS phan_tram,
                        SUM(CAST(khoi_luong AS DECIMAL(10, 2))) AS tong_khoi_luong,
                        SUM(SUM(CAST(khoi_luong AS DECIMAL(10,2)))) OVER (PARTITION BY chamcong.id_noi_dung_cong_viec) AS tong_khoi_luong_noi_dung
                    FROM
                        chamcong
                        JOIN loaicongviec ON chamcong.id_loai_cong_viec = loaicongviec.id_loai_cong_viec
                        JOIN noidungcongviec ON chamcong.id_noi_dung_cong_viec = noidungcongviec.id_noi_dung_cong_viec
                    WHERE
                        chamcong.id_loai_cong_viec != 0
                        AND chamcong.id_noi_dung_cong_viec != 0
                    GROUP BY
                        LEFT(loaicongviec.value_loai_cong_viec, 2),
                        chamcong.id_noi_dung_cong_viec,
                        noidungcongviec.value_noi_dung_cong_viec
                    ORDER BY
                        phan_tram DESC;

            ";

                // Mở kết nối và thực thi câu lệnh
                conn.Open();

                using (var cmd = new MySqlCommand(query, conn))
                {
                    var reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        if (reader.GetString("nhom_loai_cong_viec").Equals("NS"))
                        {
                            var result = new MyResult
                            {
                                IdNoiDungCongViec = reader.GetInt32("id_noi_dung_cong_viec"),
                                ValueNoiDungCongViec = reader.GetString("value_noi_dung_cong_viec"),
                                NhomLoaiCongViec = reader.GetString("nhom_loai_cong_viec"),
                                SoLanXuatHien = reader.GetInt32("so_lan_xuat_hien"),
                                TongSoLanXuatHienNoiDung = reader.GetInt32("tong_so_lan_xuat_hien_noi_dung"),
                                PhanTram = reader.GetDecimal("phan_tram"),
                                TongKhoiLuong = reader.GetDecimal("tong_khoi_luong"),
                                TongKhoiLuongNoiDung = reader.GetDecimal("tong_khoi_luong_noi_dung")
                            };

                            results.Add(reader.GetInt32("id_noi_dung_cong_viec"), result);
                        }
                    }
                }
            }

            return results;
        }

        public void updateNoiDungCongViec(string id, string value)
        {
            try
            {
                var a = this.DbContext.Noidungcongviecs.Where(n => n.IdNoiDungCongViec.ToString().Equals(id)).First();
                a.KhoiLuongTheoHopDong = double.Parse(value);
                this.DbContext.SaveChanges();
            }
            catch (Exception e)
            {

            }
        }

        public Dictionary<int, Decimal> layKhoiLuongHienTai()
        {
            var result = this.DbContext.Chamcongs
                .Where(c => c.Status == 1 && c.IdNoiDungCongViec != 0)
                .GroupBy(c => c.IdNoiDungCongViec)
                .ToDictionary(
                        g => g.Key,
                        g => g.Sum(x => decimal.TryParse(x.KhoiLuong, out var kl) ? kl : 0)
                    );
            return result;
        }

        public (DateOnly? MinDate, DateOnly? MaxDate) GetMinMaxNgayThiCong()
        {
            var minDate = this.DbContext.Chamcongs
                .Min(c => (DateOnly?)c.NgayThiCong);

            var maxDate = this.DbContext.Chamcongs
                .Max(c => (DateOnly?)c.NgayThiCong);

            return (minDate, maxDate);
        }

        public List<Dictionary<string, Object>> DSNoiDungCongViec()
        {
            var GetData = GetDataFromDatabase(ConnectStringService.Get());
            var khoiLuongHienTai = layKhoiLuongHienTai();
            var result = new List<Dictionary<string, Object>>();
            var DSNoiDungCongViec = this.DbContext.Noidungcongviecs
                .Where(nd => nd.IdNoiDungCongViec != 0)
                .ToList();
            foreach(var nd in DSNoiDungCongViec)
            {
                var r = new Dictionary<string, Object>();

                if (khoiLuongHienTai.TryGetValue(nd.IdNoiDungCongViec, out Decimal value))
                {
                    r.Add("KhoiLuong", khoiLuongHienTai[nd.IdNoiDungCongViec]);

                }
                else
                {
                    r.Add("KhoiLuong", 0);
                }

                if (GetData.TryGetValue(nd.IdNoiDungCongViec, out MyResult value2))
                {
                    r.Add("DataRatio", GetData[nd.IdNoiDungCongViec].PhanTram.ToString("F0") + "%");
                    r.Add("TB1", (GetData[nd.IdNoiDungCongViec].TongKhoiLuong / GetData[nd.IdNoiDungCongViec].SoLanXuatHien).ToString("F0"));
                    r.Add("TB2", (GetData[nd.IdNoiDungCongViec].TongKhoiLuongNoiDung / GetData[nd.IdNoiDungCongViec].TongSoLanXuatHienNoiDung).ToString("F0"));

                }
                else
                {
                    r.Add("DataRatio", "-");
                    r.Add("TB1", "-");
                    r.Add("TB2", "-");

                }
                r.Add("IdNoiDungCongViec", nd.IdNoiDungCongViec);
                r.Add("ValueNoiDungCongViec", nd.ValueNoiDungCongViec);
                r.Add("KhoiLuongTheoHopDong", nd.KhoiLuongTheoHopDong);
                r.Add("DinhMuc8h", nd.DinhMuc8h);
                r.Add("DonVi", nd.DonVi);
                result.Add(r);

            }

            return result;
        }
    }
}
