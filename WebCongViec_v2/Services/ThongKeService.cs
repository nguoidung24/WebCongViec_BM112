using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using System.Collections.Generic;
using System.Configuration;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{

    public class Total
    {
        public DateOnly ngayThiCong;
        public int idNoiDungCongViec;
        public decimal tongKhoiLuong;
    }


    public class ThongKeService : BaseService
    {
        public List<Noidungcongviec> DSNoiDungCV()
        {
            return this.DbContext.Noidungcongviecs
                .Where(row => row.IdNoiDungCongViec != 0)
                .OrderBy(row => row.IdNoiDungCongViec)
                .ToList();
        }


        public Dictionary<string, string> DSNoiDungCVTypeKeyValue()
        {
             var r = this.DbContext.Noidungcongviecs
                .Where(row => row.IdNoiDungCongViec != 0)
                .OrderBy(row => row.IdNoiDungCongViec)
                .ToList();
            var result = new Dictionary<string, string>();

            foreach (var row in r)
            {
                result.Add(row.IdNoiDungCongViec.ToString(), row.ValueNoiDungCongViec);
            }
            return result;
        }

        public Dictionary< DateOnly,List<Total>> ThongKe(DateOnly startDate, DateOnly endDate)
        {
            var result = new List<Total>();
            string connectionString = Services.ConnectStringService.Get();

            string query = @"
                WITH
                    all_dates AS (
                        SELECT DISTINCT
                            ngay_thi_cong
                        FROM
                            chamcong
                        WHERE 
                            ngay_thi_cong BETWEEN @StartDate AND @EndDate
                     ),
                    all_noi_dung AS (
                        SELECT DISTINCT
                            id_noi_dung_cong_viec
                        FROM
                            noidungcongviec
                        WHERE
                            id_noi_dung_cong_viec != 0
                    ),
                    all_combinations AS (
                        SELECT
                            d.ngay_thi_cong,
                            n.id_noi_dung_cong_viec
                        FROM
                            all_dates d
                        CROSS JOIN all_noi_dung n
                    )
                SELECT
                    ac.ngay_thi_cong,
                    ac.id_noi_dung_cong_viec,
                    COALESCE(
                        SUM(
                            CAST(c.khoi_luong AS DECIMAL(10, 0))
                        ),
                        0
                    ) AS tong_khoi_luong
                FROM
                    all_combinations ac
                LEFT JOIN chamcong c ON
                    ac.ngay_thi_cong = c.ngay_thi_cong
                    AND ac.id_noi_dung_cong_viec = c.id_noi_dung_cong_viec
                    AND c.status != 0
                GROUP BY
                    ac.ngay_thi_cong,
                    ac.id_noi_dung_cong_viec
                ORDER BY
                    ac.ngay_thi_cong,
                    ac.id_noi_dung_cong_viec;

            ";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@StartDate", startDate);
                        command.Parameters.AddWithValue("@EndDate", endDate);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.Add(new Total()
                                {
                                    ngayThiCong = reader.GetDateOnly(0), 
                                    idNoiDungCongViec = reader.GetInt32(1), 
                                    tongKhoiLuong = reader.GetDecimal(2)      
                                });
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }

            var groupedChamCongs = result
           .GroupBy(c => c.ngayThiCong) 
           .ToDictionary(
               g => g.Key,               
               g => g.ToList()            
           );
            return groupedChamCongs;
        }
    }
}
