using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class TheoDoiCPService : BaseService
    {
        public Dictionary<int, List<Chamcong>> _layDanhSachNhanSu()
        {
            var bangLuong = this.DbContext.Chamcongs
                .Where(c => c.Status == 1)
                .Where(c => c.IdLoaiCongViec != 0 && c.IdNoiDungCongViec != 0)
                .Include(c => c.IdLoaiCongViecNavigation)
                .Include(c => c.IdNoiDungCongViecNavigation)
                .Include(c => c.IdNhanSuNavigation)
                .ToList();


            var result = bangLuong
                .GroupBy(c => c.IdNhanSu)
                .ToDictionary(group => group.Key, group => group.ToList());


            return result;
        }

        public decimal TongLuongDuAn()
        {
            decimal ResultTongLuongDuAn = 0;
            var result = new List<DataBangLuong>();
            var luongDB = _layDanhSachNhanSu();
            var TongSoNgayCong = layTongSoNgayCong();
            var dsPhatSinh = layPhatSinh();

            foreach (var c in luongDB.Values)
            {
                double luong_co_ban_so_nc = 0;
                double luong_co_ban_so_nc_quy_doi = 0;

                double luong_du_an_ns = 0;
                double luong_du_an_cc = 0;
                double luong_du_an_nsot = 0;
                double luong_du_an_ccot = 0;
                double PHATSINHTANG = 0;
                double PHATSINHGIAM = 0;
                foreach (var nhansuchamcong in c)
                {
                    // Tính lương cơ bản 
                    {
                        float _luong_co_ban_so_nc_quy_doi = 0;
                        if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.EndsWith(".OT"))
                        {
                            if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith("NS"))
                            {
                                if (nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h != 0)
                                {
                                    _luong_co_ban_so_nc_quy_doi += ((float.Parse(nhansuchamcong.KhoiLuong) / nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h) * 8);
                                }
                            }
                            else
                            {
                                _luong_co_ban_so_nc_quy_doi += float.Parse(nhansuchamcong.ThoiGian);
                            }

                            _luong_co_ban_so_nc_quy_doi *=
                                nhansuchamcong.NgayThiCong.DayOfWeek == DayOfWeek.Sunday
                                ? nhansuchamcong.IdNhanSuNavigation.HeSoCn
                                : nhansuchamcong.IdNhanSuNavigation.HeSoOtThuong;

                            luong_co_ban_so_nc_quy_doi += _luong_co_ban_so_nc_quy_doi;
                        }
                        else
                        {
                            // Nếu công việc có năng suất
                            if (nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h != 0)
                            {

                                luong_co_ban_so_nc += float.Parse(nhansuchamcong.ThoiGian);
                            }
                            // Nếu công việc 0 có năng suất
                            else
                            {
                                if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith("CC"))
                                {
                                    luong_co_ban_so_nc += float.Parse(nhansuchamcong.ThoiGian);
                                }
                            }

                        }
                    }
                    // Tính lương dự án
                    {
                        double _luong_du_an_nsot = 0;
                        double _luong_du_an_ccot = 0;

                        if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.EndsWith(".OT"))
                        {
                            if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith("NS"))
                            {
                                if (nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h != 0)
                                {
                                    _luong_du_an_nsot = double.Parse(nhansuchamcong.KhoiLuong) * Math.Round(nhansuchamcong.IdNhanSuNavigation.MucLuongDuAn8h / nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h, 5);
                                }
                            }
                            else if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith("CC"))
                            {
                                _luong_du_an_ccot = double.Parse(nhansuchamcong.ThoiGian) / 8 * nhansuchamcong.IdNhanSuNavigation.MucLuongDuAn8h;
                            }

                            _luong_du_an_nsot *=
                                    nhansuchamcong.NgayThiCong.DayOfWeek == DayOfWeek.Sunday
                                    ? nhansuchamcong.IdNhanSuNavigation.HeSoCn
                                    : nhansuchamcong.IdNhanSuNavigation.HeSoOtThuong;

                            _luong_du_an_ccot *=
                                    nhansuchamcong.NgayThiCong.DayOfWeek == DayOfWeek.Sunday
                                    ? nhansuchamcong.IdNhanSuNavigation.HeSoCn
                                    : nhansuchamcong.IdNhanSuNavigation.HeSoOtThuong;


                            luong_du_an_nsot += _luong_du_an_nsot;
                            luong_du_an_ccot += _luong_du_an_ccot;

                        }
                        else
                        {
                            if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith("NS"))
                            {
                                if (nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h != 0)
                                {
                                    luong_du_an_ns += double.Parse(nhansuchamcong.KhoiLuong) * Math.Round(nhansuchamcong.IdNhanSuNavigation.MucLuongDuAn8h / nhansuchamcong.IdNoiDungCongViecNavigation.DinhMuc8h, 5);
                                }
                            }
                            else if (nhansuchamcong.IdLoaiCongViecNavigation.ValueLoaiCongViec.StartsWith("CC"))
                            {
                                luong_du_an_cc += double.Parse(nhansuchamcong.ThoiGian) / 8 * nhansuchamcong.IdNhanSuNavigation.MucLuongDuAn8h;
                            }
                        }
                    }

                    

                }



                if (dsPhatSinh.ContainsKey(int.Parse(c[0].IdNhanSu.ToString())))
                {
                    foreach (var ps in dsPhatSinh[int.Parse(c[0].IdNhanSu.ToString())])
                    {
                        if (ps.LoaiPhatSinh == 1)
                        {
                            if (ps.KieuPhatSinh == 1)
                            {
                                PHATSINHTANG += ps.GiaTriPhatSinh;

                            }
                            else
                            {
                                PHATSINHTANG += (ps.GiaTriPhatSinh * TongSoNgayCong[int.Parse(c[0].IdNhanSu.ToString())]);
                            }

                        }
                        else
                        {
                            if (ps.KieuPhatSinh == 1)
                            {
                                PHATSINHGIAM += ps.GiaTriPhatSinh;
                            }
                            else
                            {
                                PHATSINHGIAM += (ps.GiaTriPhatSinh * TongSoNgayCong[int.Parse(c[0].IdNhanSu.ToString())]);
                            }

                        }
                    }
                }

                ResultTongLuongDuAn += decimal.Parse((
                    (luong_co_ban_so_nc / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + (luong_co_ban_so_nc_quy_doi / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + luong_du_an_ns
                    + luong_du_an_cc
                    + luong_du_an_nsot
                    + PHATSINHTANG
                    - PHATSINHGIAM
                    + luong_du_an_ccot).ToString("N2"));
            }

            return  ResultTongLuongDuAn;
        }
        public Dictionary<int, List<Phatsinh>> layPhatSinh()
        {
            var result = new Dictionary<int, List<Phatsinh>>();
            var dsPhatSinh = this.DbContext.Phatsinhs
                .ToList();

            foreach (var phatSinh in dsPhatSinh)
            {
                if (!result.ContainsKey(phatSinh.IdNhanSu))
                {
                    result[phatSinh.IdNhanSu] = new List<Phatsinh>();
                }
                result[phatSinh.IdNhanSu].Add(phatSinh);
            }

            return result;
        }
        public Dictionary<int, int> layTongSoNgayCong()
        {
            var result = this.DbContext.Chamcongs
                .GroupBy(c => c.IdNhanSu)
                .Select(g => new
                {
                    IdNhanSu = g.Key,
                    SoNgayThiCong = g.Select(c => c.NgayThiCong).Distinct().Count()
                })
                .ToDictionary(x => x.IdNhanSu, x => x.SoNgayThiCong);

            return result;
        }

        public decimal TongChiPhiKhauHaoMayScan = decimal.MaxValue;

        public void updateDuToanChiPhi(string data, string value)
        {
            try
            {
                string id = data.Split("_")[0];
                string name = data.Split("_")[1];
                if (!value.Equals(""))
                {
                    var find = this.DbContext.Bangdutoanchiphis.Where(
                            dt => dt.Id.Equals(id)
                        ).FirstOrDefault();

                    if (find != null) {

                        if (name.Equals("DuToan"))
                        {
                            find.DuToan = double.Parse(value);
                        }
                        else if (name.Equals("TamUng"))
                        {
                            find.TamUng = double.Parse(value);
                        }
                        else if (name.Equals("DaChi"))
                        {
                            find.DaChi = double.Parse(value);
                        }
                        if (name.Equals("GhiChu"))
                        {
                            find.GhiChu = value;
                        }
                        this.DbContext.SaveChanges();
                    }
 
                }

            }
            catch (Exception ex) { }
        }



        public List<Dictionary<string, string>> khauHaoMayScan()
        {
            TongChiPhiKhauHaoMayScan = 0;
            var result = new List<Dictionary<string, string>>();

            result.Add(new Dictionary<string, string>() {
                {"kichThuoc","A0"},
                {"VND", "666667"},
                {"tenMay", "Rowe 540i"},
                {"congViec", "Scan A0, Scan A1, Scan A2"},
                {"tongKhauHao", "-"},
            });

            result.Add(new Dictionary<string, string>() {
                {"kichThuoc", "A3"},
                {"VND", "66667"},
                {"tenMay", "Plustek A300"},
                {"congViec", "Scan A3"},
                {"tongKhauHao", "-"},
            });

            result.Add(new Dictionary<string, string>() {
                {"kichThuoc", "A4"},
                {"VND", "60000"},
                {"tenMay", "Kodak i24xx, Fujitsu i7140"},
                {"congViec", "Scan A4"},
                {"tongKhauHao", "-"},
            });

            result.Add(new Dictionary<string, string>() {
                {"kichThuoc", "A5"},
                {"VND", "190000"},
                {"tenMay", "Fujitsu i5530"},
                {"congViec", "Scan A5"},
                {"tongKhauHao", "-"},
            });

            result.Add(new Dictionary<string, string>() {
                {"kichThuoc", "TỔNG"},
                {"VND", ""},
                {"tenMay", ""},
                {"congViec", ""},
                {"tongKhauHao", "-"},
            });

            decimal tongKhauHao = 0;
            foreach (var r in result)
            {
                if (!r["kichThuoc"].Equals("TỔNG"))
                {
                    decimal tong = 0;
                    foreach (var cv in r["congViec"].Split(","))
                    {
                        decimal a = this.DbContext.Chamcongs
                            .Include(c => c.IdNoiDungCongViecNavigation)
                            .Where(c => c.IdNoiDungCongViecNavigation.ValueNoiDungCongViec.Trim().ToLower().StartsWith(cv.ToLower()))
                            .AsEnumerable()
                            .Select(c => decimal.TryParse(c.ThoiGian, out var tg) ? tg : 0)
                            .Sum();
                        tong = tong + a;
                    }
                    tong = tong / 8 * decimal.Parse(r["VND"]) / 2;
                    tongKhauHao += tong;
                    r["tongKhauHao"] = tong.ToString("N0");
                }
                else
                {
                    r["tongKhauHao"] = tongKhauHao.ToString("N0");

                }
                TongChiPhiKhauHaoMayScan = tongKhauHao;

            }


            return result;
        }


        public List<Dictionary<string,Bangdutoanchiphi>> duToanChiPhi()
        {
            khauHaoMayScan();
            var bangDuToanChiPhi = this.DbContext.Bangdutoanchiphis.ToList();
            var result = new List<Dictionary<string, Bangdutoanchiphi>> ();


            decimal tongLuongDuAn = TongLuongDuAn();

            foreach (var duToan in bangDuToanChiPhi)
            {
                if (duToan.NoiDungCua.Equals("0"))
                {
                    if (duToan.GhiChu.Equals("Khấu hao máy scan"))
                    {
                        duToan.DaChi = Math.Round( double.Parse(TongChiPhiKhauHaoMayScan.ToString()),0);
                    }
                    else if (duToan.GhiChu.Equals("Lương nhân sự"))
                    {
                        duToan.DaChi = double.Parse(tongLuongDuAn.ToString());
                    }
                    result.Add(new Dictionary<string, Bangdutoanchiphi>()
                    {
                        { duToan.Id, duToan },
                    });

                }
            }

            foreach (var duToan in bangDuToanChiPhi)
            {
                if (!duToan.NoiDungCua.Equals("0"))
                {
                    foreach (var r in result)
                    {
                        if (r.ContainsKey(duToan.NoiDungCua))
                        {
                            r.Add(duToan.Id, duToan);
                        }
                    }
                }
            }

            return result;
        }

    }
}
