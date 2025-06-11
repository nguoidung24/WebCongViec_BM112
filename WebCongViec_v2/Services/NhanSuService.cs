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
            }
            hasNhanSu.MucLuongCoBan8h = nhanSu.MucLuongCoBan8h;
            hasNhanSu.MucLuongDuAn8h = nhanSu.MucLuongDuAn8h;
            hasNhanSu.FsiThoiVu = nhanSu.FsiThoiVu;
            hasNhanSu.HeSoCn = nhanSu.HeSoCn;
            hasNhanSu.HeSoOtThuong = nhanSu.HeSoOtThuong;
            hasNhanSu.Status = 0;
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
                        var rows = worksheet.RangeUsed().RowsUsed();

                        foreach (var row in rows)
                        {
                            var nhanSu = this.DbContext.Nhansus.Where(r => r.IdNhanSu.ToString().Equals(row.Cell(1).GetString())).FirstOrDefault();
                            if (nhanSu != null)
                            {
                                nhanSu.HoTenNhanSu = row.Cell(2).GetString();
                            }
                            else
                            {
                                var newNhanSu = new Nhansu()
                                {
                                    IdNhanSu = int.Parse(row.Cell(1).GetString()),
                                    HoTenNhanSu = row.Cell(2).GetString(),
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
