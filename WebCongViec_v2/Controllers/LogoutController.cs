using Microsoft.AspNetCore.Mvc;

namespace WebCongViec_v2.Controllers
{
    public class LogoutController : Controller
    {
        [Route("/logout")]
        public IActionResult Index(string logout)
        {
            if (logout != null)
            {
                HttpContext.Session.Clear();
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
    }
}
