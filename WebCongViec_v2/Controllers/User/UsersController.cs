using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.User
{
    public class UsersController : Controller
    {
        private Bm112Context _context;
        private AXAService _axaService;
        public UsersController()
        {
            _context = new Bm112Context();
            _axaService = new AXAService();
        }

        [Route("/UsersController/ChamCong")]
        public async Task<IActionResult> ChamCong(string? isChamCong)
        {

            
            string ToDay = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.ToDay = "";
            ViewBag.DisplayToDay = DateTime.Now.ToString("dd/MM/yyyy");
            string ID = HttpContext.Session.GetString("ID");
            var cham_lai_cong = _context.DbWebChamCongV3s.Where(row => row.Id.Equals("_cham_cong_lai_" + ID)).FirstOrDefault();
            if (cham_lai_cong != null)
            {
                ToDay = cham_lai_cong.Data.ToString();
                ViewBag.DisplayToDay = cham_lai_cong.Data.ToString() + " ( ---Chấm công bù---)";
            }

            HttpContext.Session.SetString("ToDay", ToDay);

            ViewBag.UserName = HttpContext.Session.GetString("DisplayName");
            ViewBag.HomeUsersActive = "active";
            ViewBag.DanhSachCongViec = _context.Congviecs.Where(row => row.IdCongViec != 0).ToList();
            ViewBag.DanhSachNoiDung = _context.Noidungcongviecs.ToList();
            ViewBag.DanhSachLoaiCongViec = _context.Loaicongviecs.ToList();

            if (isChamCong != null)
            {
                return this.isChamCong();
            }

            string? UserRole = HttpContext.Session.GetString("userrole").ToString();
            string? DisplayName = HttpContext.Session.GetString("DisplayName");
            ViewBag.Name = ID + " - " + DisplayName;

            if (UserRole.Equals("3"))
            {
                ViewBag.DanhSachNoiDung = _context.Noidungcongviecs.Where(row => 
                    !row.ValueNoiDungCongViec.Equals("Hỗ trợ") 
                    && !row.ValueNoiDungCongViec.Equals("hỗ trợ")
                    && !row.ValueNoiDungCongViec.Equals("Leader")
                    && !row.ValueNoiDungCongViec.Equals("leader")
                    && !row.ValueNoiDungCongViec.Equals("Support")
                    && !row.ValueNoiDungCongViec.Equals("support")
                ).ToList();
            }
            
            //ViewBag.NSScan = await _axaService.LayNSAsync(_axaService.GetInfo("-4"), ID, "DaQuet");
            //ViewBag.NSNhapLieu = await _axaService.LayNSAsync(_axaService.GetInfo("-1"), ID, "DaNhap");
            //ViewBag.NSCheckNhapLieu = await _axaService.LayNSAsync(_axaService.GetInfo("-2"), ID, "DaKiemTra");
            return View();
        }

        public IActionResult isChamCong()
        {
            string NgayThiCong = HttpContext.Session.GetString("ToDay");
            int ntcYear = int.Parse(NgayThiCong.Split("-")[0].ToString());
            int ntcMonth = int.Parse(NgayThiCong.Split("-")[1].ToString());
            int ntcDay = int.Parse(NgayThiCong.Split("-")[2].ToString());
            DateOnly ntc = new DateOnly(ntcYear, ntcMonth, ntcDay);
            var IDUser = HttpContext.Session.GetString("ID").ToString();
            var check = _context.Chamcongs
                .Where(row => row.IdNhanSu == int.Parse(IDUser))
                .Where(row => row.NgayThiCong == ntc)
                .Where(row => row.Status == 1)
                .ToList();
            if (check.Count != 0)
            {
                return RedirectToAction("ChamCong", "UsersController", new { message = "Bạn đã chấm công ngày hôm nay rồi", messageType = "warning" });
            }
            try
            {
                float CheckThoiGian = 0;
                var IDUser_ = HttpContext.Session.GetString("ID").ToString();
                var DSCongViec = _context.Congviecs.Where(row => row.IdCongViec != 0).ToList();
                var ListCong = new List<Chamcong>();
                for (int i = 0; i < DSCongViec.Count; i++)
                {
                    var NgayThiCong_ = HttpContext.Session.GetString("ToDay");
                    var ThoiGian = HttpContext.Request.Form[(i + 1).ToString() + "ThoiGian"].ToString();
                    var KhoiLuong = HttpContext.Request.Form[(i + 1).ToString() + "KhoiLuong"].ToString();
                    var IdCongViec = HttpContext.Request.Form[(i + 1).ToString() + "IdCongViec"].ToString().Equals("") ? "0" : HttpContext.Request.Form[(i + 1).ToString() + "IdCongViec"].ToString();
                    var IdLoaiCongViec = HttpContext.Request.Form[(i + 1).ToString() + "IdLoaiCongViec"].ToString().Equals("") ? "0" : HttpContext.Request.Form[(i + 1).ToString() + "IdLoaiCongViec"].ToString();
                    var IdNoiDungCongViec = HttpContext.Request.Form[(i + 1).ToString() + "IdNoiDungCongViec"].ToString().Equals("") ? "0" : HttpContext.Request.Form[(i + 1).ToString() + "IdNoiDungCongViec"].ToString();
                    var chamcong = new Chamcong()
                    {
                        IdNhanSu = int.Parse(IDUser_),
                        NgayThiCong = new DateOnly(int.Parse(NgayThiCong_.Split("-")[0].ToString()), int.Parse(NgayThiCong_.Split("-")[1].ToString()), int.Parse(NgayThiCong_.Split("-")[2].ToString())),
                        ThoiGian = ThoiGian,
                        KhoiLuong = KhoiLuong,
                        IdCongViec = int.Parse(IdCongViec),
                        IdLoaiCongViec = int.Parse(IdLoaiCongViec),
                        IdNoiDungCongViec = int.Parse(IdNoiDungCongViec)
                    };
                    if (ThoiGian != "" && ThoiGian != null)
                    {
                        CheckThoiGian += float.Parse(ThoiGian);
                    }
                    ListCong.Add(chamcong);
                }
                if (CheckThoiGian > 14)
                {
                    return RedirectToAction("ChamCong", "UsersController", new { message = "Tổng thời gian nhỏ hơn 12", messageType = "warning" });
                }
                if (ListCong.Count != DSCongViec.Count)
                {
                    return RedirectToAction("Index", "HomeUsers", new { message = "Không thành công -  số lượng công việc không khớp", messageType = "warning" });
                }

                var dsLoaiCongViec = _context.Loaicongviecs
                    .Where(c => c.IdLoaiCongViec != 0)
                    .ToDictionary(c => c.IdLoaiCongViec, c => c.ValueLoaiCongViec);

                float CheckTongThoiGian = 0;
                foreach (var cong in ListCong)
                {
                    if (cong.IdLoaiCongViec != 0)
                    {
                        if (dsLoaiCongViec[cong.IdLoaiCongViec].Equals("NS") || dsLoaiCongViec[cong.IdLoaiCongViec].Equals("CC"))
                        {
                            CheckTongThoiGian += float.Parse(cong.ThoiGian);
                        }
                    }

                }
                if (CheckTongThoiGian > 8)
                {
                    return RedirectToAction("Index", "HomeUsers", new { message = "Không thành công -  Thời gian giờ thường không lớn hơn 8 ", messageType = "warning" });
                }



                foreach (var cong in ListCong)
                {
                    foreach (var noiDunCongViec in _context.Noidungcongviecs.Where(nd => nd.IdNoiDungCongViec != 0).ToList())
                    {
                        if(noiDunCongViec.IdNoiDungCongViec == cong.IdNoiDungCongViec)
                        {
                            if(noiDunCongViec.DinhMuc8h == 0)
                            {
                                cong.KhoiLuong = "0";
                            }
                        }
                    }



                    _context.Chamcongs.Add(cong);
                }
                _context.SaveChanges();





            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "HomeUsers", new { message = "Không thành công" , messageType = "warning" });
            }


            string IDNS_chamconglai = HttpContext.Session.GetString("ID");
            var _cham_lai_cong_ = _context.DbWebChamCongV3s.Where(row => row.Id.Equals("_cham_cong_lai_" + IDNS_chamconglai) && row.Data.Equals(HttpContext.Session.GetString("ToDay"))).FirstOrDefault();
            if(_cham_lai_cong_ != null)
            {
                _context.DbWebChamCongV3s.Remove(_cham_lai_cong_);
                _context.SaveChanges();
            }

            return RedirectToAction("Index", "HomeUsers", new { message = "Đã chấm công", messageType = "success" });
        }
    }
}
