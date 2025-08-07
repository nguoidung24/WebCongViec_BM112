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
                if(logout.Equals("true"))
                {
                    HttpContext.Session.Clear();
                    return RedirectToAction("Index", "Login");
                }
                else if(logout.Equals("outside"))
                {
                    HttpContext.Session.Clear();
                    return Json(new { status = "200" , isLogout = "1" });
                }
            }
            return Json(new { status = "500" });
        }
    }
}
