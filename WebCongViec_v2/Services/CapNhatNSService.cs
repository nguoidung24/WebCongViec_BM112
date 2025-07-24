using ClosedXML.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Collections.Generic;
using System.Globalization;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class CapNhatNSService : BaseService
    {
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
                            foreach (var row in worksheet.RowsUsed())
                            {
                                if(row.Cell(0).GetFormattedString() != "" && row.Cell(0).GetFormattedString() != "-")
                                {
                                    DateOnly.TryParseExact(row.Cell(2).GetFormattedString(), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly parsedDate);
                                    Chamcong rowData = new Chamcong()
                                    {
                                        IdNhanSu = int.Parse(row.Cell(0).GetFormattedString()),
                                        IdCongViec = 0,
                                        IdLoaiCongViec = 0,
                                        IdNoiDungCongViec = 0,
                                        NgayThiCong = parsedDate,
                                        ThoiGian = "",
                                        KhoiLuong = "",
                                        Status = 1
                                    };

                                    excelData.Add(rowData);
                                }
                            }
                        }
                    }

                    ExcelData = excelData;
                    SuccessMessage = $"Đã đọc thành công {excelData.Count} hàng từ file.";
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
