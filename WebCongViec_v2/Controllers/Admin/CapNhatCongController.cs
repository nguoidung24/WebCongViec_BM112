using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class CapNhatCongController : Controller
    {

        protected CapNhatCongService capNhatCongService;
        public CapNhatCongController()
        {
            this.capNhatCongService = new CapNhatCongService();
        }

        [Route("/CapNhatCong")]
        public IActionResult CapNhatCong(string action,string? display, int IdNhanSu, DateOnly NgayThiCong)
        {
            ViewBag.Cong = new List<string>();
            ViewBag.CapNhatCongActive = "active";
            if (display != null)
                if (display.Equals("true"))
                {
                    ViewBag.Cong = this.capNhatCongService.BangCong(NgayThiCong, IdNhanSu);
                }
            if(action != null)
                if (action.Equals("delete"))
                {
                    if(this.capNhatCongService.DeleteChamCong(NgayThiCong, IdNhanSu))
                        return RedirectToAction("CapNhatCong", "CapNhatCong", new { message = "Thành công!", messageType = "success" });
                    return RedirectToAction("CapNhatCong", "CapNhatCong", new { message = "Không thành công", messageType = "warning" });
                }
            ViewBag.IdNhanSu = IdNhanSu == 0 ? "" : IdNhanSu.ToString();
            ViewBag.NgayThiCong = NgayThiCong.ToString("yyyy-MM-dd");
            return View();
        }


        [Route("/CapNhatCongID")]
        public IActionResult CapNhatCongID(Chamcong chamCong)
        {
            string? id = HttpContext.Request.Query["id"].ToString();
            ViewBag.Cong = new List<string>();
            ViewBag.CapNhatCongActive = "active";
            if (id == null)
                return RedirectToAction("CapNhatCong", "CapNhatCong");

            try
            {
                int idCong = int.Parse(id);
                ViewBag.Cong = this.capNhatCongService.BangCongID(idCong);
            }
            catch(Exception e)
            {
                return RedirectToAction("CapNhatCong", "CapNhatCong");
            }
            return View();
        }
    }
}
