using ClosedXML.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class CapNhatNSService : BaseService
    {
    

        public void ExportChamCongToSQL(string path)
        {
            var listChamCong = this.DbContext.Chamcongs.ToList();
            var sb = new StringBuilder();

            foreach (var item in listChamCong)
            {
                string insert = string.Format(
                    "INSERT INTO `chamcong`(`id_cham_cong`, `id_nhan_su`, `id_cong_viec`, `id_loai_cong_viec`, `id_noi_dung_cong_viec`, `ngay_thi_cong`, `thoi_gian`, `khoi_luong`, `status`) " +
                    "VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}');",
                    item.IdChamCong,
                    item.IdNhanSu,
                    item.IdCongViec,
                    item.IdLoaiCongViec,
                    item.IdNoiDungCongViec,
                    item.NgayThiCong.ToString("yyyy-MM-dd"),
                    item.ThoiGian.ToString(CultureInfo.InvariantCulture),
                    item.KhoiLuong.ToString(CultureInfo.InvariantCulture),
                    item.Status
                );
                sb.AppendLine(insert);
            }

            System.IO.File.WriteAllText(path, sb.ToString());
        }



        public Dictionary<string, string> getAllNhanSu()
        {
            return this.DbContext.Nhansus
                .ToDictionary(ns => ns.IdNhanSu.ToString(), ns => ns.HoTenNhanSu);
        }


        public Dictionary<string, int> getAllCV()
        {
            return this.DbContext.Congviecs
                .ToDictionary(ns => ns.ValueCongViec.ToLower(), ns => ns.IdCongViec);
        }

        public Dictionary<string, int> getAllLCV()
        {
            return this.DbContext.Loaicongviecs
                .ToDictionary(ns => ns.ValueLoaiCongViec.ToLower(), ns => ns.IdLoaiCongViec);
        }

        public Dictionary<string, int> getAllNDCV()
        {
            return this.DbContext.Noidungcongviecs
                .ToDictionary(ns => ns.ValueNoiDungCongViec.ToLower(), ns => ns.IdNoiDungCongViec);
        }

        public (string ,string, string, List<Chamcong>) getExcelData(IFormFile fileData) {

            string FileName = "";
            string SuccessMessage = "";
            string ErrorMessage = "";
            List <Chamcong> ExcelData = new List<Chamcong>();
            if (fileData != null && fileData.Length > 0)
            {
                FileName = $"Chọn file: {fileData.FileName}";

                // Check if the uploaded file is an Excel file
                if (!fileData.FileName.EndsWith(".xlsx") && !fileData.FileName.EndsWith(".xls"))
                {
                    ErrorMessage = "Chỉ chấp nhận file Excel (.xlsx hoặc .xls).";
                    return (FileName, SuccessMessage, ErrorMessage, ExcelData);
                }

                try
                {

                    List<Chamcong> excelData = new List<Chamcong>();

                    using (var stream = new MemoryStream())
                    {
                        fileData.CopyTo(stream);
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var worksheet = workbook.Worksheet(1);
                            int countR = 1;
                            foreach (var row in worksheet.RowsUsed())
                            {
                                if(!row.Cell(1).GetFormattedString().Equals("ID") && !row.Cell(1).GetFormattedString().Equals("") && !row.Cell(1).GetFormattedString().Equals("-"))
                                {
                                    DateOnly.TryParseExact(row.Cell(3).GetFormattedString(), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly parsedDate);
                                    string thoiGianString = row.Cell(5).GetFormattedString().Trim().Equals("") ? "0" : row.Cell(5).GetFormattedString().Trim();
                                    string khoiLuongString = row.Cell(8).GetFormattedString().Trim().Equals("") ? "0" : row.Cell(8).GetFormattedString().Trim();

                                    if (double.Parse(thoiGianString) <= 8)
                                    {
                                        string thoiGianDouble = thoiGianString.Equals("0") ? "" : double.Parse(thoiGianString).ToString();
                                        string khoiLuongDouble = khoiLuongString.Equals("0") ? "" : double.Parse(khoiLuongString).ToString();
                                        Chamcong rowData = new Chamcong()
                                        {
                                            IdNhanSu = int.Parse(row.Cell(1).GetFormattedString()),
                                            IdCongViec = getAllCV()[row.Cell(4).GetFormattedString().ToLower()],
                                            IdLoaiCongViec = getAllLCV()[row.Cell(6).GetFormattedString().ToLower()],
                                            IdNoiDungCongViec = getAllNDCV()[row.Cell(7).GetFormattedString().ToLower()],
                                            NgayThiCong = parsedDate,
                                            ThoiGian = thoiGianDouble,
                                            KhoiLuong = khoiLuongDouble,
                                            Status = 1
                                        };

                                        excelData.Add(rowData);
                                    }
                                    else
                                    {
                                        throw new Exception(" thời gian không hợp lệ. (" + countR.ToString() + ")");
                                    }
                                }
                                countR++;
                            }
                        }
                    }

                    ExcelData = excelData;
                    int countInsertSuccess = 0;
                    int countUpdateSuccess = 0;
                    foreach (var item in excelData)
                    {
                        if (!this.DbContext.Chamcongs.Any(c => c.NgayThiCong == item.NgayThiCong && c.IdNhanSu == item.IdNhanSu))
                        {
                            this.DbContext.Chamcongs.Add(item);
                            countInsertSuccess++;

                        }
                        else if(this.DbContext.Chamcongs.Where(c => c.NgayThiCong == item.NgayThiCong && c.IdNhanSu == item.IdNhanSu && c.IdCongViec == 1).FirstOrDefault() != null)
                        {
                            Chamcong? checkChamCong = new Chamcong();
                            for (int i = 1; i <= 4; i++)
                            {
                                checkChamCong = this.DbContext.Chamcongs.Where(c => c.NgayThiCong == item.NgayThiCong && c.IdNhanSu == item.IdNhanSu && c.IdCongViec == i).FirstOrDefault();
                                if (checkChamCong == null)
                                {
                                    continue;
                                }
                                checkChamCong.IdLoaiCongViec = item.IdLoaiCongViec;
                                checkChamCong.IdNoiDungCongViec = item.IdNoiDungCongViec;
                                checkChamCong.ThoiGian = item.ThoiGian;
                                checkChamCong.KhoiLuong = item.KhoiLuong;
                                checkChamCong.Status = item.Status;
                                this.DbContext.Chamcongs.Update(checkChamCong);
                                this.DbContext.SaveChanges();
                            }

                            countUpdateSuccess++;
                        }
                    }
                    this.DbContext.SaveChanges();

                    SuccessMessage = $"Đã đọc được {excelData.Count} hàng từ file, thêm được: ({countInsertSuccess}) hàng vào bảng NS, cập nhật được ({countUpdateSuccess}) và bảng NS";
                }
                catch (Exception ex)
                {
                    ErrorMessage = $"Đã xảy ra lỗi khi đọc file Excel: {ex.Message}";
                }
            }
            else
            {
                FileName = "Không nhận được file nào.";
            }
            return (FileName, SuccessMessage, ErrorMessage, ExcelData);
        }
    }
}
