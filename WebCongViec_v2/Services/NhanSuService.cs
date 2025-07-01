using ClosedXML.Excel;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2016.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class NhanSuService : BaseService
    {
        public List<Nhansu> DSNhanSu()
        {
            return this.DbContext.Nhansus.ToList();
        }

        public bool SetRole(string id, int role)
        {
            try
            {
                var hasNhanSu = this.DbContext.Nhansus.Where(row => row.IdNhanSu.ToString().Equals(id)).FirstOrDefault();
                if (hasNhanSu != null)
                {
                    hasNhanSu.Role = role;
                    this.DbContext.Nhansus.Update(hasNhanSu);
                    this.DbContext.SaveChanges();
                    return true;
                }
                return false;
            }
            catch(Exception e)
            {
                return false;
            }
            return false;
        }
        public Nhansu LayNhanSu(int id)
        {
            return this.DbContext.Nhansus.Where(row => row.IdNhanSu == id).First();
        }

        public bool SuaNhanSu(Nhansu nhanSu)
        {
            var hasNhanSu = this.DbContext.Nhansus.FirstOrDefault(row => row.IdNhanSu == nhanSu.IdNhanSu);
            if (hasNhanSu == null)
                return false;
            if (!hasNhanSu.HoTenNhanSu.Trim().Equals(nhanSu.HoTenNhanSu))
            {
                hasNhanSu.HoTenNhanSu = nhanSu.HoTenNhanSu;
                hasNhanSu.ThongTinCaNhan = "";
                hasNhanSu.Status = 0;

            }
            hasNhanSu.MucLuongCoBan8h = nhanSu.MucLuongCoBan8h;
            hasNhanSu.MucLuongDuAn8h = nhanSu.MucLuongDuAn8h;
            hasNhanSu.FsiThoiVu = nhanSu.FsiThoiVu;
            hasNhanSu.HeSoCn = nhanSu.HeSoCn;
            hasNhanSu.HeSoOtThuong = nhanSu.HeSoOtThuong;
            this.DbContext.Nhansus.Update(hasNhanSu);
            this.DbContext.SaveChanges();
            return true;
        }

        public bool ThemNhanSu(Nhansu nhanSu)
        {
            var hasNhanSu = this.DbContext.Nhansus.FirstOrDefault(row => row.IdNhanSu == nhanSu.IdNhanSu);
            if (hasNhanSu != null)
                return false;
            nhanSu.Status = 0;
            nhanSu.ThongTinCaNhan = "";
            this.DbContext.Nhansus.Add(nhanSu);
            this.DbContext.SaveChanges();
            return true;
        }

        public bool ThemDanhSachNhanSu(IFormFile file)
        {

            if (file == null || file.Length == 0)
            {
                return false;
            }

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (extension != ".xlsx" && extension != ".xls")
            {
                return false;
            }

            try
            {
                using (var stream = new MemoryStream())
                {
                    file.CopyTo(stream);
                    using (var workbook = new XLWorkbook(stream))
                    {
                        var worksheet = workbook.Worksheet(1);
                        var rows = worksheet.RangeUsed().RowsUsed()
                                .Where(r => r.RowNumber() >= 8);
                        foreach (var row in rows)
                        {
                            var nhanSu = this.DbContext.Nhansus.Where(r => r.IdNhanSu.ToString().Equals(row.Cell(1).GetString())).FirstOrDefault();
                            if (nhanSu != null)
                            {
                                string HoTenNhanSu = row.Cell(2).GetFormattedString();
                                if (!nhanSu.HoTenNhanSu.ToLower().Trim().Equals(HoTenNhanSu.ToLower().Trim()))
                                {
                                    nhanSu.HoTenNhanSu = HoTenNhanSu;
                                    nhanSu.FsiThoiVu = row.Cell(3).GetFormattedString();
                                    nhanSu.MucLuongCoBan8h = float.Parse(row.Cell(4).GetFormattedString());
                                    nhanSu.MucLuongDuAn8h = float.Parse(row.Cell(5).GetFormattedString());
                                    nhanSu.HeSoOtThuong = float.Parse(row.Cell(6).GetFormattedString());
                                    nhanSu.HeSoCn = float.Parse(row.Cell(7).GetFormattedString());
                                    nhanSu.Status = 0;
                                    nhanSu.ThongTinCaNhan = "";
                                }
                                else
                                {
                                    nhanSu.FsiThoiVu = row.Cell(3).GetFormattedString();
                                    nhanSu.MucLuongCoBan8h = float.Parse(row.Cell(4).GetFormattedString());
                                    nhanSu.MucLuongDuAn8h = float.Parse(row.Cell(5).GetFormattedString());
                                    nhanSu.HeSoOtThuong = float.Parse(row.Cell(6).GetFormattedString());
                                    nhanSu.HeSoCn = float.Parse(row.Cell(7).GetFormattedString());
                                }
                                

                            }
                            else
                            {
                                var newNhanSu = new Nhansu()
                                {
                                    IdNhanSu = int.Parse(row.Cell(1).GetFormattedString()),
                                    HoTenNhanSu = row.Cell(2).GetFormattedString(),
                                    FsiThoiVu = row.Cell(3).GetFormattedString(),
                                    MucLuongCoBan8h = float.Parse(row.Cell(4).GetFormattedString()),
                                    MucLuongDuAn8h = float.Parse(row.Cell(5).GetFormattedString()),
                                    HeSoOtThuong = float.Parse(row.Cell(6).GetFormattedString()),
                                    HeSoCn = float.Parse(row.Cell(7).GetFormattedString()),
                                    Status = 0,
                                    ThongTinCaNhan = ""
                                };
                                this.DbContext.Nhansus.Add(newNhanSu);
                            }
                        }
                        this.DbContext.SaveChanges();
                    }
                }
            }
            catch
            {
                return false;
            }

            return true;
        }
    }
}
