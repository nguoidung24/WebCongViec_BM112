using Microsoft.AspNetCore.Mvc;

namespace WebCongViec_v2.Controllers.Admin
{
    public class TraCuuController : Controller
    {
        [Route("/TraCuu")]
        public IActionResult TraCuu()
        {
            ViewBag.TraCuu = "active";

            return View();
        }
    }
}
