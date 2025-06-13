using Microsoft.AspNetCore.Mvc;

namespace WebCongViec_v2.Controllers.Admin
{
    public class NangSuatController : Controller
    {
        [Route("NangSuat")]
        public IActionResult NangSuat()
        {
            return View();
        }
    }
}
