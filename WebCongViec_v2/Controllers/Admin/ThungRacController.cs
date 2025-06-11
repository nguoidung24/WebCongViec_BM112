using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class ThungRacController : Controller
    {
        protected ThungRacService thungRacService;
        public ThungRacController()
        {
            this.thungRacService = new ThungRacService();
        }

        [Route("/ThungRac")]
        public IActionResult ThungRac(string action, int IdNhanSu, DateOnly NgayThiCong)
        {
            ViewBag.ThungRacActive = "active";
            if (action != null)
            {

                if (action.Equals("KhoiPhuc"))
                {
                    if (this.thungRacService.KhoiPhuc(IdNhanSu, NgayThiCong))
                        return RedirectToAction("ThungRac", "ThungRac", new { message = "Thành công!", messageType = "success" });
                    else
                        return RedirectToAction("ThungRac", "ThungRac", new { message = "Không thành công - có thể công đã tồn tại", messageType = "warning" });
                }
                if (action.Equals("XoaVinhVien"))
                {
                    if (this.thungRacService.KhoiPhuc(IdNhanSu, NgayThiCong))
                        return RedirectToAction("ThungRac", "ThungRac", new { message = "Xóa thành công!", messageType = "success" });
                    else
                        return RedirectToAction("ThungRac", "ThungRac", new { message = "Xóa không thành công - có thể công đã tồn tại", messageType = "warning" });
                }
            }
            ViewBag.DSCong = this.thungRacService.HienThiCong();
            return View();
        }
    }
}
