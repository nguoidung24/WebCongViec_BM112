
using DocumentFormat.OpenXml.Drawing.Diagrams;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using WebCongViec_v2.Models;


namespace WebCongViec_v2.Services
{

    public class DataBangLuong()
    {
        public string id;
        public string ma_so_cccd;
        public string ma_so_thue;
        public string ho_ten;
        public string fsi_thoi_vu;

        public string luong_co_ban_muc_ngay;
        public string luong_co_ban_so_nc;
        public string luong_co_ban_thanh_tien_1;
        public string luong_co_ban_so_nc_quy_doi;
        public string luong_co_ban_thanh_tien_2;

        public string luong_du_an_muc_ngay;
        public string luong_du_an_ns;
        public string luong_du_an_cc;
        public string luong_du_an_nsot;
        public string luong_du_an_ccot;

        public string phat_sinh_tang_noi_dung;
        public string phat_sinh_tang_gia_tri;
        public string phat_sinh_giam_noi_dung;
        public string phat_sinh_giam_gia_tri;

        public string tong_cong_kps;
        public string tong_cong;

        public string so_tai_khoan;
        public string ngan_hang;

    }

    public class BangLuongService : BaseService
    {
        public double TONGLUONG = 0;

        public Dictionary<int, List<Chamcong>> _layDanhSachNhanSu(DateOnly startDate, DateOnly endDate)
        {
            var bangLuong = this.DbContext.Chamcongs
                .Where(c => c.NgayThiCong >= startDate && c.NgayThiCong <= endDate)
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

        public List<DataBangLuong> tinhLuong(DateOnly startDate, DateOnly endDate)
        {
            var result = new List<DataBangLuong>();
            var luongDB = _layDanhSachNhanSu(startDate, endDate);
            var DSTKNganHang = layTKNganHang();
            var TongSoNgayCong = layTongSoNgayCong(startDate, endDate);
            double TongCongLuong = 0;
            foreach (var c in luongDB.Values)
            {
                var d = new DataBangLuong();
                d.id = c[0].IdNhanSu.ToString();
                d.ho_ten = c[0].IdNhanSuNavigation.HoTenNhanSu.ToString();
                d.fsi_thoi_vu = c[0].IdNhanSuNavigation.FsiThoiVu.ToString();
                d.luong_co_ban_muc_ngay = c[0].IdNhanSuNavigation.MucLuongCoBan8h.ToString("N1");
                d.luong_du_an_muc_ngay = c[0].IdNhanSuNavigation.MucLuongDuAn8h.ToString("N1");

                double luong_co_ban_so_nc = 0;
                double luong_co_ban_so_nc_quy_doi = 0;

                double luong_du_an_ns = 0;
                double luong_du_an_cc = 0;
                double luong_du_an_nsot = 0;
                double luong_du_an_ccot = 0;

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

                d.luong_co_ban_so_nc = Math.Round((luong_co_ban_so_nc / 8), 1, MidpointRounding.AwayFromZero).ToString();
                d.luong_co_ban_so_nc_quy_doi = Math.Round((luong_co_ban_so_nc_quy_doi / 8), 1, MidpointRounding.AwayFromZero).ToString();
                d.luong_co_ban_thanh_tien_1 = (luong_co_ban_so_nc/8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h).ToString("N0");
                d.luong_co_ban_thanh_tien_2 = (luong_co_ban_so_nc_quy_doi/8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h).ToString("N0");
                d.luong_du_an_ns = luong_du_an_ns.ToString("N0");
                d.luong_du_an_cc = luong_du_an_cc.ToString("N0");

                d.luong_du_an_nsot = luong_du_an_nsot.ToString("N0");
                d.luong_du_an_ccot = luong_du_an_ccot.ToString("N0");
                d.tong_cong_kps = ((luong_co_ban_so_nc / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + (luong_co_ban_so_nc_quy_doi / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + luong_du_an_ns
                    + luong_du_an_cc
                    + luong_du_an_nsot
                    + luong_du_an_ccot).ToString("N0");


                var dsPhatSinh= layPhatSinh(startDate, endDate);
                double PHATSINHTANG = 0;
                double PHATSINHGIAM = 0;

                if (dsPhatSinh.ContainsKey(int.Parse(d.id)))
                {
                    foreach (var ps in dsPhatSinh[int.Parse(d.id)])
                    {
                        if (ps.LoaiPhatSinh == 1)
                        {
                            if (ps.KieuPhatSinh == 1)
                            {
                                d.phat_sinh_tang_noi_dung += $"<p> ▫ {ps.NoiDungPhatSinh} </p>";
                                d.phat_sinh_tang_gia_tri += $"<p> ▫ {ps.GiaTriPhatSinh.ToString("N0")}  </p>";
                                PHATSINHTANG += ps.GiaTriPhatSinh;

                            }
                            else
                            {
                                d.phat_sinh_tang_noi_dung += $"<p> ▫ {ps.NoiDungPhatSinh} </p>";
                                d.phat_sinh_tang_gia_tri += $"<p> ▫ {(ps.GiaTriPhatSinh * TongSoNgayCong[int.Parse(d.id)]).ToString("N0")}  </p>";
                                PHATSINHTANG += (ps.GiaTriPhatSinh * TongSoNgayCong[int.Parse(d.id)]);
                            }

                        }
                        else
                        {
                            if (ps.KieuPhatSinh == 1)
                            {
                                d.phat_sinh_giam_noi_dung += $"<p> ▫ {ps.NoiDungPhatSinh} </p>";
                                d.phat_sinh_giam_gia_tri += $"<p> ▫ {ps.GiaTriPhatSinh.ToString("N0")}  </p>";
                                PHATSINHGIAM += ps.GiaTriPhatSinh;
                            }
                            else
                            {
                                d.phat_sinh_giam_noi_dung += $"<p> ▫ {ps.NoiDungPhatSinh} </p>";
                                d.phat_sinh_giam_gia_tri += $"<p> ▫ {(ps.GiaTriPhatSinh * TongSoNgayCong[int.Parse(d.id)]).ToString("N0")}  </p>";
                                PHATSINHGIAM += (ps.GiaTriPhatSinh * TongSoNgayCong[int.Parse(d.id)]);
                            }

                        }
                    }
                }
                

                d.tong_cong = ((luong_co_ban_so_nc / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + (luong_co_ban_so_nc_quy_doi / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + luong_du_an_ns
                    + luong_du_an_cc
                    + luong_du_an_nsot
                    + luong_du_an_ccot
                    + PHATSINHTANG
                    - PHATSINHGIAM
                    ).ToString("N0");

                d.ngan_hang = " " + (DSTKNganHang.ContainsKey(int.Parse(d.id)) ? DSTKNganHang[int.Parse(d.id)]["ngan_hang"] : "");

                d.so_tai_khoan = " " + (DSTKNganHang.ContainsKey(int.Parse(d.id)) ? DSTKNganHang[int.Parse(d.id)]["so_tai_khoan"] : "");

                d.ma_so_thue = " " + (DSTKNganHang.ContainsKey(int.Parse(d.id)) ? DSTKNganHang[int.Parse(d.id)]["ma_so_thue"] : "");

                d.ma_so_cccd = " " + (DSTKNganHang.ContainsKey(int.Parse(d.id)) ? DSTKNganHang[int.Parse(d.id)]["ma_so_cccd"] : "");

                TongCongLuong += ((luong_co_ban_so_nc / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + (luong_co_ban_so_nc_quy_doi / 8 * c[0].IdNhanSuNavigation.MucLuongCoBan8h)
                    + luong_du_an_ns
                    + luong_du_an_cc
                    + luong_du_an_nsot
                    + luong_du_an_ccot
                    + PHATSINHTANG
                    - PHATSINHGIAM
                    );

                result.Add(d);

            }
            this.TONGLUONG = TongCongLuong;
            return result;
        }

        public Dictionary<int, Dictionary<string, string>> layTKNganHang()
        {
            var result = new Dictionary<int, Dictionary<string, string>>();
            var dsNhanSu = this.DbContext.Nhansus
                .Select(n => new { n.IdNhanSu, n.ThongTinCaNhan })
                .ToList();

            foreach (var ns in dsNhanSu)
            {
                var fields = ParseHtmlFields(ns.ThongTinCaNhan);

                result[ns.IdNhanSu] = new Dictionary<string, string>
                    {
                        { "so_tai_khoan", fields.ContainsKey("Số tài khoản ngân hàng") ? fields["Số tài khoản ngân hàng"] : "" },
                        { "ngan_hang", fields.ContainsKey("Ngân hàng") ? fields["Ngân hàng"] : "" },
                        { "ma_so_thue", fields.ContainsKey("Mã số thuế theo CCCD") ? fields["Mã số thuế theo CCCD"] : "" },
                        { "ma_so_cccd", fields.ContainsKey("CCCD") ? fields["CCCD"] : "" }
                    };
                        }

            return result;
        }


        public Dictionary<string, string> ParseHtmlFields(string html)
        {
            var result = new Dictionary<string, string>();
            var lines = html.Split(new[] { "<br>" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var line in lines)
            {
                int colonIndex = line.IndexOf(':');
                if (colonIndex == -1) continue;

                string key = line.Substring(0, colonIndex).Trim();
                string value = "";

                // Tìm <span>...</span>
                int spanStart = line.IndexOf("<span>", colonIndex);
                int spanEnd = line.IndexOf("</span>", spanStart);
                if (spanStart != -1 && spanEnd != -1)
                {
                    spanStart += "<span>".Length;
                    value = line.Substring(spanStart, spanEnd - spanStart).Trim();
                }

                result[key] = value;
            }

            return result;
        }


        public Dictionary<int, List<Phatsinh>> layPhatSinh(DateOnly startDate, DateOnly endDate)
        {
            var result = new Dictionary<int, List<Phatsinh>>();
            var dsPhatSinh = this.DbContext.Phatsinhs
                .Where(p => p.NgayTinhPhatSinh >= startDate && p.NgayTinhPhatSinh <= endDate)
                .ToList();

            foreach(var phatSinh in dsPhatSinh)
            {
                if (!result.ContainsKey(phatSinh.IdNhanSu))
                {
                    result[phatSinh.IdNhanSu] = new List<Phatsinh>();
                }
                result[phatSinh.IdNhanSu].Add(phatSinh);
            }

            return result;
        }




        //===================================================================================================================================


        private static int SafeParse(string value)
        {
            return int.TryParse(value, out var result) ? result : 0;
        }

        public Dictionary<int, int> layTongSoNgayCong(DateOnly startDate, DateOnly endDate)
        {
            var result = this.DbContext.Chamcongs
                .Where(c => c.NgayThiCong >= startDate && c.NgayThiCong <= endDate)
                .GroupBy(c => c.IdNhanSu)
                .Select(g => new
                {
                    IdNhanSu = g.Key,
                    SoNgayThiCong = g.Select(c => c.NgayThiCong).Distinct().Count()
                })
                .ToDictionary(x => x.IdNhanSu, x => x.SoNgayThiCong);

            return result;
        }

        public object layDanhSachNhanSu(DateOnly startDate, DateOnly endDate)
        {
            var R = new Dictionary<string, List<object>>();
            var listNhanSu = new List<Nhansu>();

            var result = this.DbContext.Chamcongs
                .Where(c => c.Status == 1 && c.IdNoiDungCongViec > 0)
                .Where(c => c.NgayThiCong >= startDate && c.NgayThiCong <= endDate)
                .Join(this.DbContext.Nhansus, c => c.IdNhanSu, n => n.IdNhanSu, (c, n) => new { c, n })
                .Join(this.DbContext.Noidungcongviecs, cn => cn.c.IdNoiDungCongViec, nd => nd.IdNoiDungCongViec, (cn, nd) => new { cn.c, cn.n, nd })
                .Join(this.DbContext.Loaicongviecs, cnd => cnd.c.IdLoaiCongViec, l => l.IdLoaiCongViec, (cnd, l) => new { cnd.c, cnd.n, cnd.nd, l })
                .GroupBy(x => new
                {
                    x.c.IdNhanSu,
                    x.n.HoTenNhanSu,
                    x.n.HeSoCn,
                    x.n.HeSoOtThuong,
                    x.n.FsiThoiVu,
                    x.n.MucLuongDuAn8h,
                    x.n.MucLuongCoBan8h,
                    x.c.NgayThiCong,
                    x.c.IdNoiDungCongViec,
                    x.nd.ValueNoiDungCongViec,
                    x.c.IdLoaiCongViec,
                    x.l.ValueLoaiCongViec,
                    x.nd.DinhMuc8h
                })
                .AsEnumerable()  // Move to in-memory operations
                .Select(g => new
                {
                    g.Key.IdNhanSu,
                    g.Key.HoTenNhanSu,
                    g.Key.IdNoiDungCongViec,
                    g.Key.ValueNoiDungCongViec,
                    g.Key.DinhMuc8h,
                    g.Key.FsiThoiVu,
                    g.Key.HeSoOtThuong,
                    g.Key.HeSoCn,
                    g.Key.NgayThiCong,
                    g.Key.MucLuongDuAn8h,
                    g.Key.MucLuongCoBan8h,
                    g.Key.IdLoaiCongViec,
                    g.Key.ValueLoaiCongViec,
                    TongKhoiLuong = g.Sum(x => SafeParse(x.c.KhoiLuong)),
                    TongThoiGian = g.Sum(x => SafeParse(x.c.ThoiGian))
                    // Count only distinct NgayThiCong for each IdNhanSu
                    //CountNgayThiCong = g.Select(x => x.c.NgayThiCong).Distinct().Count()  // Ensure no duplicate dates
                })
                .ToList();

            foreach (var item in result)
            {
                if (R.ContainsKey(item.IdNhanSu.ToString()))
                {

                    R[item.IdNhanSu.ToString()].Add(item);
                }
                else
                {
                    R.Add(item.IdNhanSu.ToString(), new List<object>(){ item});
                }
            }

            return R;
        }
    }
}
