using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class PhatSinhController : Controller
    {
        protected PhatSinhService phatSinhService;
        public PhatSinhController()
        {
            this.phatSinhService = new PhatSinhService();
        }

        [Route("PhatSinh")]
        public IActionResult PhatSinh(string action,List<int> IdNhanSu, Phatsinh phatSinh)
        {
            ViewBag.BangLuong = "active";
            ViewBag.DSNhanSu = this.phatSinhService.dsNhanSu();
            if(action != null && action.Equals("create"))
            {
                if (IdNhanSu != null && IdNhanSu.Count > 0 && phatSinh != null)
                {
                    if (this.phatSinhService.themPhatSinh(IdNhanSu, phatSinh))
                    {
                        return RedirectToAction("PhatSinh", "PhatSinh", new { message = "Thành công!", messageType = "success" });

                    }
                    else
                    {
                        return RedirectToAction("PhatSinh", "PhatSinh", new { message = "Không thành công!", messageType = "warning" });

                    }
                }
                else
                {
                    return RedirectToAction("PhatSinh", "PhatSinh", new { message = "Không thành công!", messageType = "warning" });

                }
            }
            return View();
        }


        [Route("DSPhatSinh")]
        public IActionResult DSPhatSinh(string action, int Id)
        {
            ViewBag.DSPhatSinh = "active";
            ViewBag.TatCaPhatSinh = this.phatSinhService.TatCaPhatSinh();
            if (action != null && action.Equals("delete"))
            {
                if (Id != null)
                {
                    if (this.phatSinhService.xoaPhatSinh(Id))
                    {
                        return RedirectToAction("DSPhatSinh", "PhatSinh", new { message = "Thành công!", messageType = "success" });
                    }
                    else
                    {
                        return RedirectToAction("DSPhatSinh", "PhatSinh", new { message = "Không thành công!", messageType = "warning" });
                    }
                }
                else
                {
                    return RedirectToAction("DSPhatSinh", "PhatSinh", new { message = "Không thành công!", messageType = "warning" });
                }
            }

            return View();
        }
    }
}
