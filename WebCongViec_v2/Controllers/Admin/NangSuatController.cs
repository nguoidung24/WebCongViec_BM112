using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class NangSuatController : Controller
    {
        protected NangSuatService nangSuatService;
        public NangSuatController()
        {
            this.nangSuatService = new NangSuatService();
        }

        [Route("NangSuat")]
        public IActionResult NangSuat()
        {
            ViewBag.NangSuat = "active";

            ViewBag.DataNangSuat = this.nangSuatService.LayNangSuat();
            return View();
        }
    }
}
