using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class AdminChamCongController : Controller
    {

        protected AdminChamCongService adminChamCongService;

        public AdminChamCongController()
        {
            this.adminChamCongService = new AdminChamCongService();
        }

        [Route("/AdminChamCong")]
        public IActionResult AdminChamCong(string? action, DbWebChamCongV3 cham_cong_lai)
        {

            if(action != null)
                if(action.Equals("create"))
                    if(this.adminChamCongService.setChamLaiCong("_cham_cong_lai_"+cham_cong_lai.Id, cham_cong_lai.Data))
                        return RedirectToAction("AdminChamCong", "AdminChamCong", new { message = "Thành công", messageType = "success" });
                    else
                        return RedirectToAction("AdminChamCong", "AdminChamCong", new { message = "Không thành công", messageType = "warning" });

            if (action != null)
                if (action.Equals("delete"))
                    if (this.adminChamCongService.unSetChamLaiCong(cham_cong_lai.Id, cham_cong_lai.Data))
                        return RedirectToAction("AdminChamCong", "AdminChamCong", new { message = "Thành công", messageType = "success" });
                    else
                        return RedirectToAction("AdminChamCong", "AdminChamCong", new { message = "Không thành công", messageType = "warning" });

            ViewBag.DSChamCongLai = this.adminChamCongService.getDSChamCongBu();
            ViewBag.DSNhanSu = this.adminChamCongService.getDSNhanSu();
            ViewBag.AdminChamCongActive = "active";
            return View();
        }
    }
}
